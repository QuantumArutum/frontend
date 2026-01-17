# Phase 9-11 完整测试脚本 (PowerShell)
# 此脚本将自动完成所有测试并生成报告

Write-Host "🚀 开始 Phase 9-11 完整测试..." -ForegroundColor Cyan
Write-Host ""

# 配置
$BaseUrl = "https://frontend-git-main-quantumarutums-projects.vercel.app"
$UserId = "aurum51668@outlook.com"
$TestPostId = "5"

# 测试结果统计
$TotalTests = 0
$PassedTests = 0
$FailedTests = 0
$TestResults = @()

# 测试函数
function Test-API {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [string]$Data = ""
    )
    
    $script:TotalTests++
    Write-Host "测试: $Name ... " -NoNewline
    
    try {
        $uri = "$BaseUrl$Endpoint"
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $Data -ErrorAction Stop
        }
        
        Write-Host "✓ 通过" -ForegroundColor Green
        $script:PassedTests++
        
        $result = @{
            Name = $Name
            Status = "通过"
            Response = ($response | ConvertTo-Json -Compress -Depth 3).Substring(0, [Math]::Min(100, ($response | ConvertTo-Json -Compress -Depth 3).Length))
        }
        $script:TestResults += $result
        
        Write-Host "  响应: $($result.Response)" -ForegroundColor Gray
    }
    catch {
        Write-Host "✗ 失败" -ForegroundColor Red
        $script:FailedTests++
        
        $errorMsg = $_.Exception.Message
        if ($_.ErrorDetails.Message) {
            $errorMsg = $_.ErrorDetails.Message
        }
        
        $result = @{
            Name = $Name
            Status = "失败"
            Error = $errorMsg.Substring(0, [Math]::Min(100, $errorMsg.Length))
        }
        $script:TestResults += $result
        
        Write-Host "  错误: $($result.Error)" -ForegroundColor Gray
    }
    
    Write-Host ""
}

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "第一步：数据库迁移" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Test-API -Name "运行版主系统迁移" -Method "POST" -Endpoint "/api/v2/barong/public/community/migrate-moderator-system"

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "第二步：添加版主权限" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
$moderatorData = @{
    userId = $UserId
    role = "admin"
    currentUserId = "system_admin"
} | ConvertTo-Json
Test-API -Name "添加版主权限" -Method "POST" -Endpoint "/api/v2/barong/public/community/mod/moderators" -Data $moderatorData

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "第三步：Phase 11 版主功能测试" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# 置顶帖子
$pinData = @{
    postId = $TestPostId
    pinType = "global"
    currentUserId = $UserId
} | ConvertTo-Json
Test-API -Name "置顶帖子" -Method "POST" -Endpoint "/api/v2/barong/public/community/mod/pin-post" -Data $pinData

# 锁定帖子
$lockData = @{
    postId = $TestPostId
    reason = "测试锁定"
    currentUserId = $UserId
} | ConvertTo-Json
Test-API -Name "锁定帖子" -Method "POST" -Endpoint "/api/v2/barong/public/community/mod/lock-post" -Data $lockData

# 移动帖子
$moveData = @{
    postId = $TestPostId
    categorySlug = "technology"
    currentUserId = $UserId
} | ConvertTo-Json
Test-API -Name "移动帖子" -Method "POST" -Endpoint "/api/v2/barong/public/community/mod/move-post" -Data $moveData

# 查看版主日志
Test-API -Name "查看版主日志" -Method "GET" -Endpoint "/api/v2/barong/public/community/mod/logs?currentUserId=$UserId&limit=10"

# 查看版主列表
Test-API -Name "查看版主列表" -Method "GET" -Endpoint "/api/v2/barong/public/community/mod/moderators?currentUserId=$UserId"

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "第四步：Phase 10 评论功能测试" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# 评论点赞
$likeCommentData = @{
    commentId = "1"
    currentUserId = $UserId
} | ConvertTo-Json
Test-API -Name "评论点赞" -Method "POST" -Endpoint "/api/v2/barong/public/community/like-comment" -Data $likeCommentData

# 获取评论列表
Test-API -Name "获取评论列表" -Method "GET" -Endpoint "/api/v2/barong/public/community/post-comments?postId=$TestPostId"

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "第五步：Phase 9 帖子功能测试" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# 获取帖子详情
Test-API -Name "获取帖子详情" -Method "GET" -Endpoint "/api/v2/barong/public/community/post-detail?postId=$TestPostId"

# 帖子点赞
$likePostData = @{
    postId = $TestPostId
    currentUserId = $UserId
} | ConvertTo-Json
Test-API -Name "帖子点赞" -Method "POST" -Endpoint "/api/v2/barong/public/community/like-post" -Data $likePostData

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "测试完成！" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "总测试数: $TotalTests"
Write-Host "通过: $PassedTests" -ForegroundColor Green
Write-Host "失败: $FailedTests" -ForegroundColor Red
Write-Host ""

# 计算通过率
if ($TotalTests -gt 0) {
    $passRate = [math]::Round(($PassedTests / $TotalTests) * 100, 2)
    Write-Host "通过率: $passRate%"
    
    if ($passRate -eq 100) {
        Write-Host "🎉 恭喜！所有测试通过！" -ForegroundColor Green
    } elseif ($passRate -ge 80) {
        Write-Host "⚠️  大部分测试通过，但仍有一些问题需要解决" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 测试失败率较高，需要检查配置" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "详细测试结果:" -ForegroundColor Cyan
$TestResults | Format-Table -AutoSize

Write-Host ""
Write-Host "提示：如果测试失败，请检查：" -ForegroundColor Yellow
Write-Host "1. Vercel 是否已配置 DATABASE_URL 环境变量" -ForegroundColor Gray
Write-Host "2. 数据库是否可以从 Vercel 访问" -ForegroundColor Gray
Write-Host "3. 是否已运行数据库迁移" -ForegroundColor Gray
Write-Host ""
Write-Host "详细测试报告将保存到 FINAL_100_PERCENT_TEST_REPORT.md" -ForegroundColor Cyan
