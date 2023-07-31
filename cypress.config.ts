import { defineConfig } from "cypress";

const { verifyDownloadTasks } = require("cy-verify-downloads");

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", verifyDownloadTasks);
    },
    excludeSpecPattern: ["**/downloads/*"],
    viewportWidth: 550,
    viewportHeight: 750,
    baseUrl: "http://localhost:3000",
  },
});
