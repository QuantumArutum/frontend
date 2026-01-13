import { test, expect } from '@playwright/test';

test.describe('Community User Journey', () => {
  const uniqueId = Date.now().toString();
  const user = {
    firstName: `Test`,
    lastName: `User${uniqueId}`,
    email: `test${uniqueId}@example.com`,
    phone: '1234567890',
    dateOfBirth: '2000-01-01',
    country: 'usa',
    password: 'Password123!',
    securityAnswer: 'TestAnswer'
  };

  test('Full Flow: Register -> Login -> Community Features', async ({ page }) => {
    // 1. Registration
    await page.goto('/auth/register');

    // Step 1: Basic Info
    await page.fill('input[name="firstName"]', user.firstName);
    await page.fill('input[name="lastName"]', user.lastName);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="phone"]', user.phone);
    await page.fill('input[name="dateOfBirth"]', user.dateOfBirth);
    await page.selectOption('select[name="country"]', user.country);
    await page.click('button:has-text("Next")');

    // Step 2: Password
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button:has-text("Next")');

    // Step 3: Security
    await page.selectOption('select[name="securityQuestion"]', 'q1');
    await page.fill('input[name="securityAnswer"]', user.securityAnswer);
    await page.click('button:has-text("Next")');

    // Step 4: Terms
    await page.check('input[name="agreeTerms"]');
    await page.check('input[name="agreePrivacy"]');
    await page.check('input[name="agreeMarketing"]');
    
    // Mock Registration API
    await page.route('/api/auth/register', async route => {
      await route.fulfill({ json: { success: true } });
    });

    await page.click('button:has-text("Create Account")');

    // Verify redirect or success message
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    
    // 2. Login
    // Note: The register page redirects to login after 3 seconds. 
    // We can fast-track this by navigating manually or waiting.
    await page.goto('/auth/login');

    // Mock Login API
    await page.route('/api/auth/login', async route => {
      await route.fulfill({ 
        json: { 
          success: true,
          data: {
            token: 'mock_jwt_token',
            user: {
              id: `user_${uniqueId}`,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
            },
            redirect_url: '/dashboard'
          }
        } 
      });
    });

    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Wait for redirect
    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Community Features
    await page.goto('/community');
    
    // Create Post
    await page.click('a[href="/community/create-post"]'); // Adjust selector if needed
    
    // Mock Create Post API
    await page.route('/api/community/posts', async route => {
      await route.fulfill({ json: { success: true } });
    });

    await page.fill('input[placeholder*="标题"]', 'My First Post'); // Using placeholder based on previous fix
    await page.fill('textarea', 'This is the content of my first post.');
    await page.click('button:has-text("发布帖子")');
    await expect(page).toHaveURL(/\/community/);

    // View Post (Mocking list and detail)
    await page.route('**/api/community/posts*', async route => {
        const url = route.request().url();
        if (url.includes('id=')) {
             // Detail
             await route.fulfill({ json: { success: true, data: { posts: [{ id: '1', title: 'My First Post', content: 'This is the content of my first post.', category: 'general', userId: `user_${uniqueId}`, userName: `${user.firstName} ${user.lastName}`, createdAt: new Date().toISOString() }] } } });
        } else {
             // List
             await route.fulfill({ json: { success: true, data: { posts: [{ id: '1', title: 'My First Post', content: 'This is the content of my first post.', category: 'general', userId: `user_${uniqueId}`, userName: `${user.firstName} ${user.lastName}`, createdAt: new Date().toISOString() }] } } });
        }
    });
    
    await page.goto('/community/post/1');
    // Specify the heading more precisely to avoid conflict with navbar h1
    await expect(page.locator('h1.text-3xl')).toContainText('My First Post');

    // Comment
    await page.route('**/api/community/posts/1/comments', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: { success: true } });
      } else {
        await route.fulfill({ json: { success: true, data: [] } });
      }
    });

    await page.fill('textarea[data-testid="comment-input"]', 'Nice post!');
    await page.click('button:has-text("发表评论")');
    // In a real app, the comment would appear. Since we mocked the GET comments to empty, it won't appear unless we update the mock. 
    // But we can check if the textarea was cleared or success message.
    await expect(page.locator('textarea[data-testid="comment-input"]')).toHaveValue('');

    // Like
    await page.route('**/api/community/posts/1/like*', async route => {
        if (route.request().method() === 'POST') {
            await route.fulfill({ json: { success: true } });
        } else {
            // Return updated like count
             await route.fulfill({ json: { success: true, data: { likeCount: 1, dislikeCount: 0, userLike: 'like' } } });
        }
    });

    await page.click('button[data-testid="like-button"]');
    await expect(page.locator('button[data-testid="like-button"]')).toHaveClass(/bg-blue-600/);

    // 4. Other Community Features

    // 4.1 Category Navigation
    // Click on "技术交流" (Technical)
    await page.click('a[href="/community/forum/technical"]');
    await expect(page).toHaveURL(/\/community\/forum\/technical/);
    await expect(page.locator('h1.text-3xl')).toContainText('技术交流');

    // 4.2 Search
    // Mock Search API
    await page.route('/api/community/search*', async route => {
        await route.fulfill({ 
            json: { 
                success: true, 
                data: { 
                    posts: [
                        { 
                            id: 'search_1', 
                            title: 'Quantum Search Result', 
                            content: 'Content matching query', 
                            category: 'general', 
                            userId: 'u1', 
                            userName: 'Search User', 
                            commentCount: 0,
                            likeCount: 0,
                            createdAt: new Date().toISOString() 
                        }
                    ] 
                } 
            } 
        });
    });

    const searchInput = page.locator('input[placeholder="搜索讨论..."]');
    await searchInput.click();
    await searchInput.pressSequentially('Quantum', { delay: 100 });
    await expect(searchInput).toHaveValue('Quantum');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL(/\/community\/search\?q=Quantum/);
    await expect(page.locator('text=Quantum Search Result')).toBeVisible();

    // 4.3 User Profile
    // Click on user avatar in navbar to go to profile
    // The avatar link is: /community/user/[userName]
    // We mocked the user name as `${user.firstName} ${user.lastName}` -> "Test User..."
    const userName = `${user.firstName} ${user.lastName}`;
    const encodedName = encodeURIComponent(userName);
    
    // Sometimes the avatar is hidden in a menu on mobile, but we assume desktop view for playwright by default
    await page.click(`a[href="/community/user/${encodedName}"]`);
    await expect(page).toHaveURL(new RegExp(`/community/user/${encodedName.replace(/ /g, '%20')}`));
    await expect(page.locator('h2', { hasText: userName })).toBeVisible();

    // 4.4 Notifications & Messages
    await page.click('a[href="/community/notifications"]');
    await expect(page).toHaveURL(/\/community\/notifications/);

    await page.click('a[href="/community/messages"]');
    await expect(page).toHaveURL(/\/community\/messages/);

    // 4.5 Events Page
    await page.goto('/community/events');
    await expect(page).toHaveURL(/\/community\/events/);
    
    // Mock Events API
    await page.route('**/api/community/events*', async route => {
        await route.fulfill({ 
            json: { 
                success: true, 
                data: [
                    { 
                        id: 'e1', 
                        title: 'Quantum Hackathon', 
                        description: 'Build the future', 
                        type: 'hackathon', 
                        date: '2025-01-01', 
                        time: '10:00', 
                        location: 'Online', 
                        participants: 100, 
                        status: 'upcoming', 
                        organizer: 'QAU' 
                    }
                ] 
            } 
        });
    });

    // Verify event is visible
    await page.reload();
    await expect(page.locator('text=Quantum Hackathon')).toBeVisible({ timeout: 10000 });

    // 4.6 Governance Page
    await page.click('a[href="/community/governance"]');
    await expect(page).toHaveURL(/\/community\/governance/);
    await expect(page.locator('h1', { hasText: '社区治理' })).toBeVisible();
    
    // Check Stats visibility
    await expect(page.locator('text=QAU质押总量')).toBeVisible();

    // 4.7 DeFi Forum
    await page.click('a[href="/community/forum/defi"]');
    await expect(page).toHaveURL(/\/community\/forum\/defi/);
    await expect(page.locator('h1.text-3xl')).toContainText('DeFi讨论');

    // 5. Logout
    // Ensure user menu is visible (desktop)
    // The logout button is in the user menu area in navbar
    const logoutBtn = page.locator('button[title="登出"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    
    // Verify logout state
    // Should verify that "Login" button appears or user avatar disappears
    // The navbar shows "登录" (Login) button when logged out
    await expect(page.locator('a[href*="/auth/login"]', { hasText: '登录' })).toBeVisible();

  });
});
