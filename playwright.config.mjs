import { defineConfig, devices } from "@playwright/test";

const hostedBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.e2e\.mjs/,
  timeout: 30000,
  workers: 1,
  expect: { timeout: 5000 },
  use: {
    baseURL: hostedBaseURL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: hostedBaseURL ? undefined : {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [
    {
      name: "chromium-desktop",
      testIgnore: /mobile\.e2e\.mjs/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } },
    },
    {
      name: "chromium-stage",
      testIgnore: /mobile\.e2e\.mjs/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: "chromium-mobile",
      testMatch: /mobile\.e2e\.mjs/,
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
});
