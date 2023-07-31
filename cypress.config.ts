import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    excludeSpecPattern: ["**/downloads/*"],
    viewportWidth: 550,
    viewportHeight: 750,
    supportFile: false,
    baseUrl: "http://localhost:3000",
  },
});
