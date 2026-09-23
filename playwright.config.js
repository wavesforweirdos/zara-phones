const { defineConfig, devices } = require('@playwright/test');

const PORT = 3100;

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx webpack serve --mode development --port ${PORT} --no-open`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Fake API config: every request is intercepted in the tests (see e2e/fixtures/api.js),
    // so e2e runs never depend on a real key nor on the remote API being awake
    env: {
      API_BASE_URL: 'https://api.e2e.test',
      API_KEY: 'e2e-api-key',
    },
  },
});
