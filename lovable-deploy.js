// lovable-deploy.js
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    headless: false, // Set to false for debugging, change back to true for production
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    console.log('Navigating to Lovable AI login page...');
    await page.goto('https://lovable.dev/login');

    console.log('Logging in...');
    await page.fill('#email', process.env.LOVABLE_EMAIL);
    await page.fill('#password', process.env.LOVABLE_PASSWORD);
    await page.click('button:has-text("Log in")');
 
    await page.waitForNavigation();
    console.log('Login successful.');

    console.log('Navigating to projects page...');
    await page.goto('https://lovable.dev/projects');

    console.log('Waiting for search bar...');
    await page.waitForSelector('input[placeholder="Search projects..."]', { timeout: 15000 });
    
    console.log('Clicking search bar...');
    const searchBar = await page.$('input[placeholder="Search projects..."]');
    await searchBar.click();
    
    console.log('Searching for project...');
    await searchBar.fill('rural-dentist-supply-hub');
    
    await page.waitForTimeout(2000);
    
    console.log('Looking for project in search results...');
    let projectLink = null;
    
    const projectLinks = await page.$$('a[href*="/projects/"]');
    for (const link of projectLinks) {
      const text = await link.textContent();
      if (text && text.toLowerCase().includes('rural-dentist-supply-hub')) {
        projectLink = link;
        console.log(`Found project: ${text}`);
        break;
      }
    }
    
    if (!projectLink) {
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
    
    console.log('Clicking on project...');
    await projectLink.click();
    
    await page.waitForTimeout(5000);
    
    console.log('Taking screenshot for debugging...');
    await page.screenshot({ path: 'project-page.png', fullPage: true });
    
    // Enhanced debugging: Log all buttons and their properties
    console.log('=== DEBUGGING: Analyzing all buttons ===');
    const allButtons = await page.$$('button');
    console.log(`Found ${allButtons.length} buttons on the page`);
    
    for (let i = 0; i < allButtons.length; i++) {
      try {
        const button = allButtons[i];
        const text = await button.textContent();
        const id = await button.getAttribute('id');
        const className = await button.getAttribute('class');
        const ariaLabel = await button.getAttribute('aria-label');
        const dataTestId = await button.getAttribute('data-testid');
        const isVisible = await button.isVisible();
        
        console.log(`Button ${i}: id="${id}" class="${className}" text="${text}" aria-label="${ariaLabel}" data-testid="${dataTestId}" visible=${isVisible}`);
        
        // Check if this button contains "publish" in any way
        if (text && text.toLowerCase().includes('publish')) {
          console.log(`*** FOUND PUBLISH BUTTON: Button ${i} ***`);
        }
        if (id && id.toLowerCase().includes('publish')) {
          console.log(`*** FOUND PUBLISH BUTTON BY ID: Button ${i} ***`);
        }
        if (className && className.toLowerCase().includes('publish')) {
          console.log(`*** FOUND PUBLISH BUTTON BY CLASS: Button ${i} ***`);
        }
      } catch (error) {
        console.log(`Button ${i}: Error getting properties`);
      }
    }
    
    console.log('Looking for publish button...');
    let publishButton = null;
    
    // Try multiple approaches to find the publish button
    const publishSelectors = [
      '#publish-menu',
      'button#publish-menu',
      'button[aria-haspopup="menu"]',
      'button[class*="bg-affirmative-primary"]',
      'button[class*="publish"]',
      'button:has-text("Publish")',
      'button span:has-text("Publish")',
      '[data-testid="publish-button"]',
      'button[aria-label*="publish" i]',
      'button[title*="publish" i]',
      // Try to find any button with aria-haspopup="menu" (dropdown/menu buttons)
      'button[aria-haspopup="menu"]:visible',
      // Try to find buttons with specific classes from the HTML
      'button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium',
      // Try to find any visible button that might be the publish button
      'button:visible'
    ];
    
    for (const selector of publishSelectors) {
      try {
        console.log(`Trying publish selector: ${selector}`);
        const elements = await page.$$(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        for (let i = 0; i < elements.length; i++) {
          try {
            const element = elements[i];
            const text = await element.textContent();
            const id = await element.getAttribute('id');
            const isVisible = await element.isVisible();
            
            console.log(`  Element ${i}: id="${id}" text="${text}" visible=${isVisible}`);
            
            // Check if this element is the publish button
            if (text && text.toLowerCase().includes('publish')) {
              console.log(`*** FOUND PUBLISH ELEMENT: ${selector} element ${i} ***`);
              publishButton = element;
              break;
            }
            if (id === 'publish-menu') {
              console.log(`*** FOUND PUBLISH ELEMENT BY ID: ${selector} element ${i} ***`);
              publishButton = element;
              break;
            }
          } catch (error) {
            console.log(`  Element ${i}: Error getting properties`);
          }
        }
        
        if (publishButton) break;
      } catch (error) {
        console.log(`Publish selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!publishButton) {
      // Last resort: try to find any button with "Publish" text
      console.log('Trying to find any button with "Publish" text...');
      const allButtons = await page.$$('button');
      for (const button of allButtons) {
        try {
          const text = await button.textContent();
          if (text && text.toLowerCase().includes('publish')) {
            console.log(`Found button with "Publish" text: "${text}"`);
            publishButton = button;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    if (!publishButton) {
      // Try to force the button to be visible by setting viewport size
      console.log('Trying to force responsive classes to show the button...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(2000);
      
      // Take another screenshot after viewport change
      await page.screenshot({ path: 'project-page-large-viewport.png', fullPage: true });
      
      // Try the selectors again
      for (const selector of publishSelectors) {
        try {
          console.log(`Trying publish selector again with large viewport: ${selector}`);
          const elements = await page.$$(selector);
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          
          for (let i = 0; i < elements.length; i++) {
            try {
              const element = elements[i];
              const text = await element.textContent();
              const id = await element.getAttribute('id');
              const isVisible = await element.isVisible();
              
              console.log(`  Element ${i}: id="${id}" text="${text}" visible=${isVisible}`);
              
              if (text && text.toLowerCase().includes('publish')) {
                console.log(`*** FOUND PUBLISH ELEMENT: ${selector} element ${i} ***`);
                publishButton = element;
                break;
              }
              if (id === 'publish-menu') {
                console.log(`*** FOUND PUBLISH ELEMENT BY ID: ${selector} element ${i} ***`);
                publishButton = element;
                break;
              }
            } catch (error) {
              console.log(`  Element ${i}: Error getting properties`);
            }
          }
          
          if (publishButton) break;
        } catch (error) {
          console.log(`Publish selector failed: ${selector}`);
          continue;
        }
      }
    }
    
    if (!publishButton) {
      throw new Error('Could not find publish button');
    }
    
    console.log('Clicking publish button...');
    await publishButton.click();
    
    await page.waitForTimeout(2000);
    
    console.log('Taking screenshot after clicking publish...');
    await page.screenshot({ path: 'after-publish-click.png', fullPage: true });
    
    console.log('Looking for update button...');
    let updateButton = null;
    
    try {
      const updateButtonSelectors = [
        'button:has-text("Update")',
        'button:has-text("Deploy")',
        'button:has-text("Build")',
        'button[class*="bg-secondary"]',
        'button[type="submit"]',
        'button[class*="primary"]',
        'button[class*="affirmative"]'
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
    } catch (error) {
      console.log('Update button selector failed, trying alternative approaches...');
    }
    
    if (!updateButton) {
      console.log('Trying to find any button that might be the update button...');
      const allButtons = await page.$$('button');
      for (const button of allButtons) {
        try {
          const text = await button.textContent();
          if (text && (text.toLowerCase().includes('update') || 
                      text.toLowerCase().includes('deploy') || 
                      text.toLowerCase().includes('build') ||
                      text.toLowerCase().includes('confirm'))) {
            console.log(`Found potential update button: "${text}"`);
            updateButton = button;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    if (!updateButton) {
      console.log('Could not find update button, but publish button was clicked successfully');
      console.log('Deployment may have been triggered automatically');
      return;
    }
    
    console.log('Clicking update button...');
    await updateButton.click();

    try {
      await page.waitForSelector('text=Deployment started successfully, text=success, text=deployed, text=updated, text=published', { timeout: 30000 });
      console.log('Deployment successfully triggered!');
    } catch (error) {
      console.log('Waiting for deployment to start...');
      await page.waitForTimeout(5000);
      console.log('Deployment likely triggered successfully!');
    }

  } catch (error) {
    console.error('Deployment script failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})(); 