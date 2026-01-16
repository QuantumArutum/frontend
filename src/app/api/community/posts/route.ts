/**
 * 社区帖子 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse, ValidationRule } from '@/lib/security/middleware';
import { InputValidator, SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { db } from '@/lib/database';

// 类型定义
interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
    isLocked: boolean;
}

// 允许的分类
const ALLOWED_CATEGORIES = ['general', 'technology', 'trading', 'governance', 'support', 'announcements'];

// GET - 获取所有帖子
export const GET = createSecureHandler(
    async (request: NextRequest): Promise<NextResponse> => {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const category = searchParams.get('category');
        const limitStr = searchParams.get('limit') || '50';
        const offsetStr = searchParams.get('offset') || '0';

        // 验证参数
        const limit = parseInt(limitStr);
        const offset = parseInt(offsetStr);
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return errorResponse('limit 参数必须在 1-100 之间', 400);
        }
        if (isNaN(offset) || offset < 0) {
            return errorResponse('offset 参数必须大于等于 0', 400);
        }
        if (category && !ALLOWED_CATEGORIES.includes(category)) {
            return errorResponse('无效的分类参数', 400);
        }

        try {
            // 使用数据库查询
            // @ts-ignore
            const result = await db.getPosts({
                limit,
                offset,
                category: category || undefined,
                id: id || undefined
            });

            const postsArray = result?.posts || [];
            const total = result?.total || postsArray.length;

            return successResponse({
                data: {
                    posts: postsArray,
                    total: total,
                    hasMore: postsArray.length === limit
                }
            });
        } catch (error: any) {
            console.error('Database error:', error);
            return errorResponse('获取帖子失败: ' + error.message, 500);
        }
    },
    { rateLimit: true, allowedMethods: ['GET'] }
);

// POST 验证规则
const postValidationRules: ValidationRule[] = [
    { field: 'title', type: 'string', required: true, min: 1, max: 200 },
    { field: 'content', type: 'string', required: true, min: 1, max: 10000 },
    { field: 'category', type: 'string', required: false, custom: (v) => !v || ALLOWED_CATEGORIES.includes(v as string) },
    { field: 'userId', type: 'string', required: true, min: 1, max: 100 },
];

// POST - 创建新帖子
export const POST = createSecureHandler(
    async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
        const ip = getClientIP(request);
        const userAgent = getUserAgent(request);
        
        const data = validatedData || {};
        const { title, content, category, userId } = data as any;

        try {
            // 获取分类ID
            let categoryId = 1; // 默认为 general
            if (category) {
                // @ts-ignore
                const categories = await db.getCategories();
                const cat = categories?.data?.find((c: any) => c.slug === category);
                if (cat) categoryId = cat.id;
            }

            // @ts-ignore
            const newPost = await db.createPost({
                user_id: userId,
                title,
                content,
                category_id: categoryId,
                status: 'published'
            });

            if (!newPost) {
                return errorResponse('创建帖子失败', 500);
            }

            SecurityLogger.log(
                SecurityEventType.TRANSACTION_COMPLETED,
                'info',
                { action: 'create_post', postId: newPost.id },
                userId,
                ip,
                userAgent
            );

            return successResponse({
                data: newPost,
                message: '帖子创建成功'
            });
        } catch (error: any) {
             console.error('Database error:', error);
             return errorResponse('创建帖子失败: ' + error.message, 500);
        }
    },
    { 
        rateLimit: true, 
        validateBody: postValidationRules,
        allowedMethods: ['POST'],
        logRequest: true 
    }
);
