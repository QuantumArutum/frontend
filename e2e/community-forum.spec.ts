import { test, expect } from '@playwright/test';

test.describe('Community Forum Tests', () => {

  // Mock user data for login simulation
  const mockUser = {
    id: 'test_user_1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
  };

  test('Guest User - View Forum and Search', async ({ page }) => {
    await page.goto('/community/forum');
    
    // Check header
    await expect(page.locator('h1')).toContainText('Community Forum');
    
    // Check categories exist
    const categories = page.locator('a[href^="/community/forum/"]');
    await expect(categories).toHaveCount(6); // Based on the code seen (6 categories)
    
    // Search functionality
    const searchInput = page.getByPlaceholder('搜索分类...');
    await searchInput.fill('General');
    await expect(categories).toHaveCount(1);
    await expect(page.locator('h3', { hasText: 'General Discussion' })).toBeVisible();
    
    // Navigation to category
    await page.click('text=General Discussion');
    await expect(page).toHaveURL(/\/community\/forum\/general/);
  });

  test('Guest User - View Post Details', async ({ page }) => {
    // Mock API for post details with wildcard
    await page.route('**/api/community/posts*', async route => {
      // Return a mock post for ID 1
      await route.fulfill({ json: { success: true, data: { posts: [{ id: '1', title: 'Test Post', content: 'Content', category: 'general', userId: 'u1', userName: 'User', createdAt: new Date().toISOString() }] } } });
    });
    await page.route('**/api/community/posts/1/comments', async route => {
      await route.fulfill({ json: { success: true, data: [] } });
    });
    await page.route('**/api/community/posts/1/like*', async route => {
      await route.fulfill({ json: { success: true, data: { likeCount: 5, dislikeCount: 0, userLike: null } } });
    });

    // Navigate to a known post (assuming mock data exists for ID '1')
    await page.goto('/community/post/1');
    
    // Wait for loading to finish
    await expect(page.getByText('加载中...')).toBeHidden();
    
    // Verify post content - specific selector for post title
    // The post title usually has h1 tag and specific classes in the code
    await expect(page.locator('h1.text-3xl')).toBeVisible();
    
    // Verify login prompt for actions
    // Check comment section for guest message
    // Use a more flexible text match or wait for the element
    await expect(page.locator('text=登录后可发表评论')).toBeVisible();
  });

  test.describe('Logged-in User Tests', () => {
     test.beforeEach(async ({ page }) => {
          // Use addInitScript to set localStorage BEFORE page loads
          await page.addInitScript(() => {
              const user = {
                  id: 'test_user_1',
                  email: 'test@example.com',
                  name: 'Test User',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
              };
              localStorage.setItem('auth_token', 'mock_token');
              localStorage.setItem('user_info', JSON.stringify(user));
          });
      });

     test('Logged-in User - Create Post Flow', async ({ page }) => {
          // Mock API for creating post with wildcard
          await page.route('**/api/community/posts', async route => {
            console.log('Mocking create post API hit');
            const json = { success: true, message: 'Post created' };
            await route.fulfill({ json });
          });
  
          await page.goto('/community/create-post');
          
          // Debug: Check if redirected
          console.log('Current URL:', page.url());

          // Wait for auth check to finish and form to load
          await expect(page.getByText('正在验证登录状态...')).toBeHidden({ timeout: 10000 });
          
          // Check if error appeared
          const errorMsg = page.locator('.text-red-300');
          if (await errorMsg.isVisible()) {
              console.log('Error message found:', await errorMsg.textContent());
          }

          await expect(page.getByTestId('create-post-title')).toBeVisible({ timeout: 10000 });
           
           // Fill form
           await page.selectOption('select', 'general');
           // Use placeholder to target the correct input, avoiding navbar search
           await page.getByPlaceholder('输入帖子标题...').fill('E2E Test Post Title');
           await page.fill('textarea', 'This is a comprehensive E2E test post content.');
           
           // Submit
          await page.click('button:has-text("发布帖子")');
          
          // Expect redirection to community page
          await expect(page).toHaveURL(/\/community/);
        });
   
       test('Logged-in User - Comment on Post', async ({ page }) => {
         // Mock API for post details with wildcard
         await page.route('**/api/community/posts*', async route => {
           console.log('Mocking post details API hit:', route.request().url());
           await route.fulfill({ json: { success: true, data: { posts: [{ id: '1', title: 'Test Post', content: 'Content', category: 'general', userId: 'u1', userName: 'User', createdAt: new Date().toISOString() }] } } });
         });
         await page.route('**/api/community/posts/1/comments', async route => {
           await route.fulfill({ json: { success: true, data: [] } });
         });
         await page.route('**/api/community/posts/1/like*', async route => {
           await route.fulfill({ json: { success: true, data: { likeCount: 5, dislikeCount: 0, userLike: null } } });
         });
  
         await page.goto('/community/post/1');
         
         // Wait for loading
         await expect(page.getByText('加载中...')).toBeHidden();
   
         // Check for error state
         const errorDiv = page.locator('text=帖子不存在');
         if (await errorDiv.isVisible()) {
             console.log('Post not found error displayed');
         }
         const loadError = page.locator('text=加载失败');
         if (await loadError.isVisible()) {
             console.log('Load failed error displayed');
         }

         // Check if comment form is visible
         const commentBox = page.getByTestId('comment-input');
         await expect(commentBox).toBeVisible();
         
         // Add comment
         const commentText = 'This is a test comment from E2E';
         await commentBox.fill(commentText);
         // Mock comment submission
         await page.route('**/api/community/posts/1/comments', async route => {
            if (route.request().method() === 'POST') {
               await route.fulfill({ json: { success: true } });
            } else {
               // Return updated comments
               await route.fulfill({ json: { success: true, data: [{ id: 'c1', content: commentText, userName: 'Test User', createdAt: new Date().toISOString() }] } });
            }
         });
  
         await page.click('button:has-text("发表评论")');
         
         // Verify comment appears
         await expect(page.locator(`text=${commentText}`)).toBeVisible();
       });
   
       test('Logged-in User - Like Post', async ({ page }) => {
         // Mock API for post details with wildcard
         await page.route('**/api/community/posts*', async route => {
           await route.fulfill({ json: { success: true, data: { posts: [{ id: '1', title: 'Test Post', content: 'Content', category: 'general', userId: 'u1', userName: 'User', createdAt: new Date().toISOString() }] } } });
         });
         await page.route('**/api/community/posts/1/comments', async route => {
           await route.fulfill({ json: { success: true, data: [] } });
         });
         await page.route('**/api/community/posts/1/like*', async route => {
           if (route.request().method() === 'POST') {
               await route.fulfill({ json: { success: true } });
           } else {
               // Initial state
               await route.fulfill({ json: { success: true, data: { likeCount: 5, dislikeCount: 0, userLike: null } } });
           }
         });
  
         await page.goto('/community/post/1');
         
         // Wait for loading
         await expect(page.getByText('加载中...')).toBeHidden();

         // Check for error state
         if (await page.locator('text=帖子不存在').isVisible() || await page.locator('text=加载失败').isVisible()) {
             console.log('Post load error in Like test');
         }
         
         // Find like button
         const likeButton = page.getByTestId('like-button');
         
         await expect(likeButton).toBeVisible();
         
         // Ensure button is enabled and ready
         await expect(likeButton).toBeEnabled();
         
         // Update mock for subsequent get
          await page.route('**/api/community/posts/1/like*', async route => {
            if (route.request().method() === 'GET') {
               await route.fulfill({ json: { success: true, data: { likeCount: 6, dislikeCount: 0, userLike: 'like' } } });
            } else if (route.request().method() === 'POST') {
               await route.fulfill({ json: { success: true } });
            }
          });
   
          await likeButton.click();
         
         // Verify visual change (e.g., class change for color)
         // Code: bg-blue-600 text-white when liked
         await expect(likeButton).toHaveClass(/bg-blue-600/);
       });
   });

});
