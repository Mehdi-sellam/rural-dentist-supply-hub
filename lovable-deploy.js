// lovable-deploy.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to Lovable AI login page...');
    await page.goto('https://lovable.dev/login'); // Or whatever the login URL is

    console.log('Logging in...');
    // Use the correct selectors for the email and password fields
    await page.fill('input[name="email"]', process.env.LOVABLE_EMAIL);
    await page.fill('input[name="password"]', process.env.LOVABLE_PASSWORD);
    await page.click('button[type="submit"]');
 
    // Wait for navigation to complete after login
    await page.waitForNavigation();
    console.log('Login successful.');

    // Navigate directly to your project's page
    console.log('Navigating to project dashboard...');
    await page.goto('https://lovable.dev/projects/44513973-80d4-47ad-af0b-72c980249b28');

    // Click the necessary buttons to deploy
    console.log('Starting deployment...');
    // IMPORTANT: You must find the correct selectors for these buttons
    await page.click('button:has-text("Share")'); 
    await page.click('button:has-text("Publish")');

    // Optional: Wait for a confirmation message
    await page.waitForSelector('text=Deployment started successfully', { timeout: 60000 });
    console.log('Deployment successfully triggered!');

  } catch (error) {
    console.error('Deployment script failed:', error);
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close();
  }
})();