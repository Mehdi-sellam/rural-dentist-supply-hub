// lovable-deploy.js
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to Lovable AI login page...');
    await page.goto('https://lovable.dev/login'); // Or whatever the login URL is

    console.log('Logging in...');
    // Use the correct selectors for the email and password fields
    await page.fill('#email', process.env.LOVABLE_EMAIL);
    await page.fill('#password', process.env.LOVABLE_PASSWORD);
    await page.click('button:has-text("Log in")');
 
    // Wait for navigation to complete after login
    await page.waitForNavigation();
    console.log('Login successful.');

    // Navigate directly to your project's page
    console.log('Navigating to project dashboard...');
    await page.goto('https://lovable.dev/projects/44513973-80d4-47ad-af0b-72c980249b28');

    // Wait for the page to load and find the project card
    console.log('Waiting for project card to load...');
    await page.waitForSelector('body > div.flex.min-h-0.flex-1.flex-col > div > main > div > div > div:nth-child(1) > div.grid.w-full.grid-cols-1.gap-6.md\\:grid-cols-3.lg\\:grid-cols-4 > div:nth-child(1) > a > div > img', { timeout: 30000 });
    
    // Click on the project card to open it
    console.log('Clicking on project card...');
    await page.click('body > div.flex.min-h-0.flex-1.flex-col > div > main > div > div > div:nth-child(1) > div.grid.w-full.grid-cols-1.gap-6.md\\:grid-cols-3.lg\\:grid-cols-4 > div:nth-child(1) > a');
    
    // Wait for the project page to load
    await page.waitForTimeout(3000);
    
    // Click the publish menu
    console.log('Clicking publish menu...');
    await page.click('#publish-menu > span');
    
    // Wait for the publish menu to open and click the publish button
    console.log('Clicking publish button...');
    await page.click('#radix-\\:r74\\: > div.flex.items-center.justify-between.gap-2.pb-2\\.5.pl-2\\.5.pr-4.pt-1\\.5 > div > button:nth-child(2)');

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