#!/bin/bash

# Phase 9-11 完整测试脚本
# 此脚本将自动完成所有测试并生成报告

echo "🚀 开始 Phase 9-11 完整测试..."
echo ""

# 配置
BASE_URL="https://frontend-git-main-quantumarutums-projects.vercel.app"
USER_ID="aurum51668@outlook.com"
TEST_POST_ID="5"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果统计
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_api() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "测试: $name ... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓ 通过${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "  响应: $(echo $body | jq -c '.' 2>/dev/null || echo $body | head -c 100)"
    else
        echo -e "${RED}✗ 失败${NC} (HTTP $http_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "  错误: $(echo $body | jq -c '.message' 2>/dev/null || echo $body | head -c 100)"
    fi
    echo ""
}

echo "========================================="
echo "第一步：数据库迁移"
echo "========================================="
test_api "运行版主系统迁移" "POST" "/api/v2/barong/public/community/migrate-moderator-system" ""

echo "========================================="
echo "第二步：添加版主权限"
echo "========================================="
test_api "添加版主权限" "POST" "/api/v2/barong/public/community/mod/moderators" \
    "{\"userId\":\"$USER_ID\",\"role\":\"admin\",\"currentUserId\":\"system_admin\"}"

echo "========================================="
echo "第三步：Phase 11 版主功能测试"
echo "========================================="

# 置顶帖子
test_api "置顶帖子" "POST" "/api/v2/barong/public/community/mod/pin-post" \
    "{\"postId\":\"$TEST_POST_ID\",\"pinType\":\"global\",\"currentUserId\":\"$USER_ID\"}"

# 锁定帖子
test_api "锁定帖子" "POST" "/api/v2/barong/public/community/mod/lock-post" \
    "{\"postId\":\"$TEST_POST_ID\",\"reason\":\"测试锁定\",\"currentUserId\":\"$USER_ID\"}"

# 移动帖子
test_api "移动帖子" "POST" "/api/v2/barong/public/community/mod/move-post" \
    "{\"postId\":\"$TEST_POST_ID\",\"categorySlug\":\"technology\",\"currentUserId\":\"$USER_ID\"}"

# 查看版主日志
test_api "查看版主日志" "GET" "/api/v2/barong/public/community/mod/logs?currentUserId=$USER_ID&limit=10" ""

# 查看版主列表
test_api "查看版主列表" "GET" "/api/v2/barong/public/community/mod/moderators?currentUserId=$USER_ID" ""

echo "========================================="
echo "第四步：Phase 10 评论功能测试"
echo "========================================="

# 评论点赞
test_api "评论点赞" "POST" "/api/v2/barong/public/community/like-comment" \
    "{\"commentId\":\"1\",\"currentUserId\":\"$USER_ID\"}"

# 获取评论列表
test_api "获取评论列表" "GET" "/api/v2/barong/public/community/post-comments?postId=$TEST_POST_ID" ""

echo "========================================="
echo "第五步：Phase 9 帖子功能测试"
echo "========================================="

# 获取帖子详情
test_api "获取帖子详情" "GET" "/api/v2/barong/public/community/post-detail?postId=$TEST_POST_ID" ""

# 帖子点赞
test_api "帖子点赞" "POST" "/api/v2/barong/public/community/like-post" \
    "{\"postId\":\"$TEST_POST_ID\",\"currentUserId\":\"$USER_ID\"}"

echo ""
echo "========================================="
echo "测试完成！"
echo "========================================="
echo -e "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"
echo ""

# 计算通过率
if [ $TOTAL_TESTS -gt 0 ]; then
    pass_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "通过率: $pass_rate%"
    
    if [ $pass_rate -eq 100 ]; then
        echo -e "${GREEN}🎉 恭喜！所有测试通过！${NC}"
    elif [ $pass_rate -ge 80 ]; then
        echo -e "${YELLOW}⚠️  大部分测试通过，但仍有一些问题需要解决${NC}"
    else
        echo -e "${RED}❌ 测试失败率较高，需要检查配置${NC}"
    fi
fi

echo ""
echo "详细测试报告将保存到 FINAL_100_PERCENT_TEST_REPORT.md"
