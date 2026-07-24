import { defineConfig, devices } from '@playwright/test';

// Node 22 nativo — carga .env local si existe (en CI las vars vienen del entorno).
try {
  process.loadEnvFile('.env');
} catch {
  // .env no existe (ej. CI) — seguir con process.env tal cual.
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
const isStaging = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Local: 1 worker, un solo navegador visible a la vez, corre en orden. CI: headless + paralelo.
  workers: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: !!process.env.CI,
    launchOptions: process.env.CI ? {} : { slowMo: 250 },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge', storageState: 'e2e/.auth/admin.json' },
      dependencies: ['setup'],
    },
  ],
  // Solo levanta el dev server local si NO se apunta a staging con PLAYWRIGHT_BASE_URL.
  webServer: isStaging
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
