// Use the pre-installed npx playwright (1.56.1) chromium via PLAYWRIGHT_BROWSERS_PATH
import { chromium } from '/home/user/game/node_modules/playwright-core/index.js';

const EXEC = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';
const file = 'file:///home/user/game/IsometricPlatformer/simulation.html';

const browser = await chromium.launch({
  headless: true,
  executablePath: EXEC,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage();
await page.setViewportSize({ width: 900, height: 440 });
await page.goto(file, { waitUntil: 'load' });
await page.waitForTimeout(800);

await page.screenshot({ path: '/home/user/game/sim_initial.png' });
console.log('initial');

await page.keyboard.down('ArrowRight');
await page.waitForTimeout(900);
await page.keyboard.press('Space');
await page.waitForTimeout(600);
await page.screenshot({ path: '/home/user/game/sim_jump.png' });
console.log('jump');

await page.waitForTimeout(1000);
await page.screenshot({ path: '/home/user/game/sim_running.png' });
console.log('running');

await browser.close();
