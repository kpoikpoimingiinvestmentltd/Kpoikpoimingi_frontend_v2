import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3100/api';
const BASE_URL = process.env.E2E_DASHBOARD_URL || 'http://127.0.0.1:5174';

function resolveChromePath(): string | undefined {
  if (process.env.PW_CHROME_PATH) return process.env.PW_CHROME_PATH;
  if (process.env.PW_CHANNEL) return undefined;

  const candidates = [
    path.join(
      os.homedir(),
      'Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    ),
    path.join(
      os.homedir(),
      'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    ),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

const chromePath = resolveChromePath();
const channel = process.env.PW_CHANNEL || (!chromePath ? 'chrome' : undefined);

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ...process.env,
      VITE_API_URL: API_URL,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(chromePath ? { executablePath: chromePath } : {}),
        ...(channel ? { channel } : {}),
      },
    },
  ],
});
