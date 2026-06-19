import { defineConfig, devices } from '@playwright/test';

// Cross-browser / cross-viewport screenshot sweep for the design-handoff
// verification gate. Engines: Chromium, Firefox, WebKit (desktop) + mobile
// Safari (iPhone) and a tablet (iPad). The route × theme axis is in
// test/brand-screenshots.spec.ts. The site is static — build first, then
// `pnpm preview` serves dist/ on :4321.
export default defineConfig({
  testDir: './test',
  testMatch: /brand-screenshots\.spec\.ts/,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'pnpm preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { ...devices['iPad (gen 7)'] } },
  ],
});
