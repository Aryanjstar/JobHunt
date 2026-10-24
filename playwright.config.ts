import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 180_000,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3210" },
  webServer: {
    command: "npm run dev -- --port 3210",
    url: "http://127.0.0.1:3210",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
