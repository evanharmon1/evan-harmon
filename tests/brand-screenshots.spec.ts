// brand-screenshots.spec.ts — the implement-design cross-browser sweep.
//
// Runs under `task verify:browsers` (npx playwright test). The engine × device
// axis comes from playwright.config.ts `projects`; this spec adds the
// route × theme axis and writes one full-page PNG per route × theme per project
// into screenshots/<project>/.
//
// The Almanac toggles theme via `data-palette` on <html> (default Midnight),
// persisted in localStorage["almanac-theme"]. setTheme seeds that key before the
// page's inline ThemeScript runs, so the chosen palette paints from first frame.
import { test, type Page } from '@playwright/test';

const ROUTES = ['/', '/brand'];
const THEMES = { Parchment: 'parchment', Midnight: 'midnight' } as const;

async function seedTheme(page: Page, palette: string) {
  await page.addInitScript((p) => {
    try {
      localStorage.setItem('almanac-theme', p);
    } catch {
      /* ignore */
    }
  }, palette);
}

const slugify = (route: string) => route.replace(/[^\w]+/g, '_').replace(/^_|_$/g, '') || 'home';

for (const route of ROUTES) {
  for (const [label, palette] of Object.entries(THEMES)) {
    test(`${route} [${label}]`, async ({ page }, testInfo) => {
      await seedTheme(page, palette);
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready; // avoid a flash of unstyled text in the capture
      });
      await page.screenshot({
        path: `screenshots/${testInfo.project.name}/${slugify(route)}-${label}.png`,
        fullPage: true,
      });
    });
  }
}
