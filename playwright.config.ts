import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 2,
  timeout: 60000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8788",
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  },
  webServer: {
    command: "npm run start:local",
    url: "http://127.0.0.1:8788",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
