import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.join(__dirname, 'documentation', 'assets', 'screenshots');

const BRAVE_PATH = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

async function capture() {
  console.log('🚀 Launching Brave Browser headless...');
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('📸 1. Capturing Landing Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_page.png') });

  console.log('📸 2. Capturing Login Page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_login_page.png') });

  console.log('📸 3. Capturing Registration Page...');
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_registration_page.png') });

  console.log('🔑 Authenticating via 1-Click Demo Login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  // Click the 1-Click Demo Login button
  const demoButtons = await page.$$('button');
  for (const btn of demoButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Student Demo')) {
      await btn.click();
      break;
    }
  }

  // Wait for navigation to /dashboard
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));

  console.log('📸 4. Capturing User Dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_user_dashboard.png') });

  console.log('📸 5. Capturing Daily Mood Tracker...');
  await page.goto('http://localhost:3000/moods', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_daily_mood_tracker.png') });

  console.log('📸 6. Capturing Mood Selection Interface...');
  // Focus on form area
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_mood_selection_interface.png') });

  console.log('📸 7. Capturing Personal Journal...');
  await page.goto('http://localhost:3000/journal', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_personal_journal.png') });

  console.log('📸 8. Capturing Journal Editor Modal...');
  const newEntryBtn = await page.$('button');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && txt.includes('Write New Entry')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_journal_editor_modal.png') });

  console.log('📸 9. Capturing AI Wellness Assistant...');
  await page.goto('http://localhost:3000/ai-assistant', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_ai_wellness_assistant.png') });

  console.log('📸 10. Capturing AI Crisis Response Guardrail...');
  // Type message to trigger crisis response
  await page.type('input[type="text"]', 'I am feeling overwhelmed and having thoughts of self-harm');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_ai_crisis_guardrail.png') });

  console.log('📸 11. Capturing Mindfulness & Breathing Studio...');
  await page.goto('http://localhost:3000/mindfulness', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mindfulness_breathing.png') });

  console.log('📸 12. Capturing 5-4-3-2-1 Sensory Grounding Tab...');
  const tabs = await page.$$('button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('5-4-3-2-1')) {
      await tab.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_mindfulness_grounding.png') });

  console.log('📸 13. Capturing Progress & Analytics Dashboard...');
  await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_progress_analytics.png') });

  console.log('📸 14. Capturing User Profile...');
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_user_profile.png') });

  console.log('📸 15. Capturing Settings & Security...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_settings_security.png') });

  await browser.close();
  console.log('✅ All 15 high-resolution actual screenshots successfully captured!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

