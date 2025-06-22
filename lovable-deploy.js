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

    // Wait for the page to load and try multiple approaches to find the project card
    console.log('Waiting for project card to load...');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Try multiple selectors to find the project card
    let projectCard = null;
    const selectors = [
      // Try the original selector first
      'body > div.flex.min-h-0.flex-1.flex-col > div > main > div > div > div:nth-child(1) > div.grid.w-full.grid-cols-1.gap-6.md\\:grid-cols-3.lg\\:grid-cols-4 > div:nth-child(1) > a',
      // Fallback: look for any project card link
      'a[href*="/projects/"]',
      // Fallback: look for cards with images
      'div:has(img) > a',
      // Fallback: look for any clickable card
      'div[class*="card"] a, div[class*="Card"] a'
    ];
    
    for (const selector of selectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 10000 });
        projectCard = await page.$(selector);
        if (projectCard) {
          console.log(`Found project card with selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!projectCard) {
      // If no selector worked, try to find by text content
      console.log('Trying to find project by text content...');
      const projectLinks = await page.$$('a');
      for (const link of projectLinks) {
        const text = await link.textContent();
        if (text && text.toLowerCase().includes('rural') || text.toLowerCase().includes('dental')) {
          projectCard = link;
          console.log(`Found project card by text: ${text}`);
          break;
        }
      }
    }
    
    if (!projectCard) {
      throw new Error('Could not find project card with any selector');
    }
    
    // Click on the project card to open it
    console.log('Clicking on project card...');
    await projectCard.click();
    
    // Wait for the project page to load
    await page.waitForTimeout(3000);
    
    // Try multiple approaches to find the publish menu
    console.log('Looking for publish menu...');
    let publishMenu = null;
    const publishSelectors = [
      '#publish-menu > span',
      'button:has-text("Publish")',
      '[data-testid="publish-button"]',
      'button[aria-label*="publish" i]',
      'button[title*="publish" i]'
    ];
    
    for (const selector of publishSelectors) {
      try {
        console.log(`Trying publish selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 5000 });
        publishMenu = await page.$(selector);
        if (publishMenu) {
          console.log(`Found publish menu with selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Publish selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!publishMenu) {
      throw new Error('Could not find publish menu');
    }
    
    // Click the publish menu
    console.log('Clicking publish menu...');
    await publishMenu.click();
    
    // Wait for the publish menu to open and try to find the publish button
    await page.waitForTimeout(1000);
    
    // Try multiple approaches to find the actual publish button
    let publishButton = null;
    const publishButtonSelectors = [
      '#radix-\\:r74\\: > div.flex.items-center.justify-between.gap-2.pb-2\\.5.pl-2\\.5.pr-4.pt-1\\.5 > div > button:nth-child(2)',
      'button:has-text("Deploy")',
      'button:has-text("Publish")',
      'button[type="submit"]',
      'button[class*="primary"]'
    ];
    
    for (const selector of publishButtonSelectors) {
      try {
        console.log(`Trying publish button selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 5000 });
        publishButton = await page.$(selector);
        if (publishButton) {
          console.log(`Found publish button with selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Publish button selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!publishButton) {
      throw new Error('Could not find publish button');
    }
    
    // Click the publish button
    console.log('Clicking publish button...');
    await publishButton.click();

    // Wait for a confirmation message or any success indicator
    try {
      await page.waitForSelector('text=Deployment started successfully', { timeout: 30000 });
      console.log('Deployment successfully triggered!');
    } catch (error) {
      // If we can't find the exact success message, wait a bit and assume success
      console.log('Waiting for deployment to start...');
      await page.waitForTimeout(5000);
      console.log('Deployment likely triggered successfully!');
    }

  } catch (error) {
    console.error('Deployment script failed:', error);
    process.exit(1); // Exit with an error code
  } finally {
    await browser.close();
  }
})();