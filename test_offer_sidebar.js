const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testOfferSidebar() {
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('📍 Step 1: Navigate to money-model page');
    await page.goto('http://localhost:3000/money-model', { waitUntil: 'networkidle0' });
    
    // Take initial screenshot
    const screenshotDir = '/Users/kesonpurpose/Downloads/UIB ASSETS/Cursor App Build/alex-hormozi-ai/alex-hormozi-ai/screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '1_initial_state.png'),
      fullPage: true
    });
    console.log('✅ Initial state screenshot saved');

    console.log('📍 Step 2: Wait for offers to load');
    await page.waitForSelector('.offer-node', { timeout: 10000 });

    console.log('📍 Step 3: Look for Add Offer buttons');
    const addOfferButtons = await page.$$('[class*="Add Offer"], button:contains("Add"), button[class*="add"]');
    if (addOfferButtons.length === 0) {
      console.log('Looking for alternative add offer methods...');
      await page.screenshot({ 
        path: path.join(screenshotDir, '2_looking_for_add_buttons.png'),
        fullPage: true
      });
    }

    console.log('📍 Step 4: Look for existing offers with edit buttons');
    const offerNodes = await page.$$('.offer-node');
    console.log(`Found ${offerNodes.length} offer nodes`);

    if (offerNodes.length > 0) {
      console.log('📍 Step 5: Click on first offer to select it');
      await offerNodes[0].click();
      await page.waitForTimeout(1000);

      // Look for edit button
      console.log('📍 Step 6: Looking for edit button (✏️ or Edit)');
      let editButton;
      
      // Try different selectors for edit button
      const editSelectors = [
        'button[title*="edit"]',
        'button:contains("Edit")',
        'button:contains("✏️")',
        '[data-testid="edit-button"]',
        '.edit-button',
        'button[class*="edit"]'
      ];

      for (const selector of editSelectors) {
        try {
          editButton = await page.$(selector);
          if (editButton) {
            console.log(`Found edit button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Selector might not be valid, continue
        }
      }

      if (editButton) {
        console.log('📍 Step 7: Click edit button to open sidebar');
        await editButton.click();
        await page.waitForTimeout(2000);

        await page.screenshot({ 
          path: path.join(screenshotDir, '3_sidebar_open.png'),
          fullPage: true
        });
        console.log('✅ Sidebar open screenshot saved');

        // Test if sidebar is visible
        const sidebar = await page.$('[class*="sidebar"], [class*="panel"], [class*="drawer"]');
        if (sidebar) {
          console.log('✅ Sidebar detected in DOM');
          
          console.log('📍 Step 8: Test form fields in sidebar');
          
          // Look for form inputs
          const nameInput = await page.$('input[id="name"], input[placeholder*="name"]');
          const descInput = await page.$('textarea[id="description"], textarea[placeholder*="description"]');
          const priceInput = await page.$('input[id="price"], input[type="number"]');

          if (nameInput) {
            console.log('📍 Step 9: Test editing name field');
            await nameInput.click();
            await nameInput.selectText();
            await nameInput.type(' (Edited via Test)');
            console.log('✅ Name field edited');
          }

          if (priceInput) {
            console.log('📍 Step 10: Test editing price field');
            await priceInput.click();
            await priceInput.selectText();
            await priceInput.type('999');
            console.log('✅ Price field edited');
          }

          console.log('📍 Step 11: Look for Save button');
          const saveButton = await page.$('button:contains("Save"), button[type="submit"], .save-button');
          if (saveButton) {
            console.log('📍 Step 12: Click Save button');
            await saveButton.click();
            await page.waitForTimeout(2000);

            await page.screenshot({ 
              path: path.join(screenshotDir, '4_after_save.png'),
              fullPage: true
            });
            console.log('✅ After save screenshot saved');

            console.log('📍 Step 13: Verify sidebar closed and changes applied');
            const sidebarAfter = await page.$('[class*="sidebar"], [class*="panel"], [class*="drawer"]');
            if (!sidebarAfter) {
              console.log('✅ Sidebar closed after save');
            } else {
              console.log('⚠️ Sidebar still open after save');
            }

          } else {
            console.log('❌ Save button not found');
          }

        } else {
          console.log('❌ Sidebar not detected after clicking edit');
        }

      } else {
        console.log('❌ Edit button not found');
        await page.screenshot({ 
          path: path.join(screenshotDir, '2_no_edit_button.png'),
          fullPage: true
        });
      }
    } else {
      console.log('❌ No offer nodes found');
    }

    // Check for console errors
    const logs = await page.evaluate(() => {
      return window.console.errors || [];
    });
    console.log('Console errors:', logs);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testOfferSidebar().then(() => {
  console.log('🎉 Test completed!');
}).catch(err => {
  console.error('Test error:', err);
});