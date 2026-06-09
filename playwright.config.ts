import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(__dirname, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const e2ePort = process.env.PLAYWRIGHT_PORT || "3099";
const isCi = Boolean(process.env.CI);
/** Local: reutiliza `npm run dev` (3000). CI: servidor dedicado na 3099 após build. */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  (isCi ? `http://localhost:${e2ePort}` : "http://localhost:3000");
const isLocal = /localhost|127\.0\.0\.1/i.test(baseURL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 120_000,
  expect: { timeout: 30_000 },
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 25_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: isCi
    ? {
        command: `npm run build && npx next start -p ${e2ePort}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 300_000,
        env: {
          ...process.env,
          NEXT_PUBLIC_BASE_URL: baseURL,
          MERCADOPAGO_USE_SANDBOX: "true",
          MERCADOPAGO_ACCESS_TOKEN: "",
          MERCADOPAGO_TEST_ACCESS_TOKEN: "",
        },
      }
    : undefined,
});
