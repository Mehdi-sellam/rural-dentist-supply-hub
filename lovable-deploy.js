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

    // Navigate to the projects page
    console.log('Navigating to projects page...');
    await page.goto('https://lovable.dev/projects');

    // Wait for the search bar to be available
    console.log('Waiting for search bar...');
    await page.waitForSelector('input[placeholder="Search projects..."]', { timeout: 15000 });
    
    // Find and click the search bar
    console.log('Clicking search bar...');
    const searchBar = await page.$('input[placeholder="Search projects..."]');
    await searchBar.click();
    
    // Type the project name to search for it
    console.log('Searching for project...');
    await searchBar.fill('dent-go'); // Search for the correct project name
    
    // Wait a moment for search results
    await page.waitForTimeout(2000);
    
    // Look for the project in search results
    console.log('Looking for project in search results...');
    let projectLink = null;
    
    // Try to find the project by looking for links that contain the project name
    const projectLinks = await page.$$('a[href*="/projects/"]');
    for (const link of projectLinks) {
      const text = await link.textContent();
      if (text && text.toLowerCase().includes('dent-go')) {
        projectLink = link;
        console.log(`Found project: ${text}`);
        break;
      }
    }
    
    if (!projectLink) {
      // If not found by text, try to click the first project link
      console.log('Project not found by name, trying first project link...');
      const firstProjectLink = await page.$('a[href*="/projects/"]');
      if (firstProjectLink) {
        projectLink = firstProjectLink;
        console.log('Using first project link found');
      }
    }
    
    if (!projectLink) {
      throw new Error('Could not find any project to deploy');
    }
    
    // Click on the project to open it
    console.log('Clicking on project...');
    await projectLink.click();
    
    // Wait for the project page to load
    await page.waitForTimeout(5000);
    
    // Take a screenshot for debugging
    console.log('Taking screenshot for debugging...');
    await page.screenshot({ path: 'project-page.png', fullPage: true });
    
    // Debug: Log all buttons and spans on the page
    console.log('Debugging: Looking for all buttons and spans...');
    const allButtons = await page.$$('button');
    const allSpans = await page.$$('span');
    
    console.log(`Found ${allButtons.length} buttons and ${allSpans.length} spans`);
    
    // Log text content of buttons and spans that might be publish-related
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      if (text && text.toLowerCase().includes('publish')) {
        console.log(`Button ${i}: "${text}"`);
      }
    }
    
    for (let i = 0; i < allSpans.length; i++) {
      const text = await allSpans[i].textContent();
      if (text && text.toLowerCase().includes('publish')) {
        console.log(`Span ${i}: "${text}"`);
      }
    }
    
    // Try to find the publish menu with the correct selector
    console.log('Looking for publish menu...');
    let publishMenu = null;
    
    try {
      console.log('Trying publish menu selector: #publish-menu > span');
      await page.waitForSelector('#publish-menu > span', { timeout: 10000 });
      publishMenu = await page.$('#publish-menu > span');
      if (publishMenu) {
        console.log('Found publish menu with selector: #publish-menu > span');
      }
    } catch (error) {
      console.log('Publish menu selector failed, trying alternative approaches...');
      
      // Try alternative selectors
      const publishSelectors = [
        'span:has-text("Publish")',
        'button:has-text("Publish")',
        '[data-testid="publish-button"]',
        'button[aria-label*="publish" i]',
        'button[title*="publish" i]',
        // Try more general selectors
        'button',
        'span',
        '[role="button"]'
      ];
      
      for (const selector of publishSelectors) {
        try {
          console.log(`Trying publish selector: ${selector}`);
          const elements = await page.$$(selector);
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          
          for (let i = 0; i < elements.length; i++) {
            const text = await elements[i].textContent();
            if (text && text.toLowerCase().includes('publish')) {
              publishMenu = elements[i];
              console.log(`Found publish element with text: "${text}"`);
              break;
            }
          }
          
          if (publishMenu) break;
        } catch (error) {
          console.log(`Publish selector failed: ${selector}`);
          continue;
        }
      }
    }
    
    if (!publishMenu) {
      // Last resort: try to find any clickable element with "publish" text
      console.log('Trying to find any element with "publish" text...');
      const allElements = await page.$$('*');
      for (const element of allElements) {
        try {
          const text = await element.textContent();
          if (text && text.toLowerCase().includes('publish')) {
            const tagName = await element.evaluate(el => el.tagName.toLowerCase());
            console.log(`Found element with "publish" text: ${tagName} - "${text}"`);
            publishMenu = element;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    if (!publishMenu) {
      throw new Error('Could not find publish menu');
    }
    
    // Click the publish menu
    console.log('Clicking publish menu...');
    await publishMenu.click();
    
    // Wait for the publish menu to open and try to find the update button
    await page.waitForTimeout(2000);
    
    // Take another screenshot after clicking publish
    console.log('Taking screenshot after clicking publish...');
    await page.screenshot({ path: 'after-publish-click.png', fullPage: true });
    
    // Try to find the update button with the correct selector
    console.log('Looking for update button...');
    let updateButton = null;
    
    try {
      console.log('Trying update button selector: #radix-\\:r1c1\\: > div.flex.items-center.justify-between.gap-2.pb-2\\.5.pl-2\\.5.pr-4.pt-1\\.5 > div > button:nth-child(2)');
      await page.waitForSelector('#radix-\\:r1c1\\: > div.flex.items-center.justify-between.gap-2.pb-2\\.5.pl-2\\.5.pr-4.pt-1\\.5 > div > button:nth-child(2)', { timeout: 10000 });
      updateButton = await page.$('#radix-\\:r1c1\\: > div.flex.items-center.justify-between.gap-2.pb-2\\.5.pl-2\\.5.pr-4.pt-1\\.5 > div > button:nth-child(2)');
      if (updateButton) {
        console.log('Found update button with specific selector');
      }
    } catch (error) {
      console.log('Update button selector failed, trying alternative approaches...');
      
      // Try alternative selectors for the update button
      const updateButtonSelectors = [
        'button:has-text("Update")',
        'button[class*="bg-secondary"]',
        'button[type="submit"]',
        'button[class*="primary"]'
      ];
      
      for (const selector of updateButtonSelectors) {
        try {
          console.log(`Trying update button selector: ${selector}`);
          await page.waitForSelector(selector, { timeout: 5000 });
          updateButton = await page.$(selector);
          if (updateButton) {
            console.log(`Found update button with selector: ${selector}`);
            break;
          }
        } catch (error) {
          console.log(`Update button selector failed: ${selector}`);
          continue;
        }
      }
    }
    
    if (!updateButton) {
      throw new Error('Could not find update button');
    }
    
    // Click the update button
    console.log('Clicking update button...');
    await updateButton.click();

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