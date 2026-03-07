const { execSync } = require('child_process');

const isRender = Boolean(process.env.RENDER);
const env = { ...process.env };

if (!env.PUPPETEER_CACHE_DIR && isRender) {
  env.PUPPETEER_CACHE_DIR = '/opt/render/.cache/puppeteer';
}

try {
  execSync('npx puppeteer browsers install chrome', {
    stdio: 'inherit',
    env,
  });
} catch (error) {
  console.error('Failed to install Chrome for Puppeteer.');
  if (isRender) process.exit(1);
}
