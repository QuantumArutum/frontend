/**
 * 社区搜索 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';
import { InputValidator } from '@/lib/security';

export const GET = createSecureHandler(
    async (request: NextRequest): Promise<NextResponse> => {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return errorResponse('搜索词不能为空', 400);
        }
        
        // 验证搜索查询长度（防止DoS攻击）
        if (query.length > 100) {
            return errorResponse('搜索查询过长', 400);
        }
        
        // 清理搜索查询（防止XSS和SQL注入）
        const sanitizedQuery = InputValidator.sanitizeHtml(query.trim());

        // 这里应该从数据库搜索
        // 暂时返回空结果
        return successResponse({
            data: {
                posts: [],
                total: 0,
                query: sanitizedQuery
            }
        });
    },
    { rateLimit: true, allowedMethods: ['GET'] }
);
