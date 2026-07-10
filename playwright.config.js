import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 90000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'API Tests',
      testMatch: /tests\/api\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: true,
        },
      },
    },
    {
      name: 'UI Tests',
      testMatch: /tests\/ui\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    }
  ]
});

