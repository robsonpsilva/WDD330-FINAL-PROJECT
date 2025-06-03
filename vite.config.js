import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        details: resolve(__dirname, "src/details/details.html"),
        join: resolve(__dirname, "src/join/join.html"),
        sell: resolve(__dirname, "src/cart/sell.html"),
        schedule: resolve(__dirname, "src/schedule/schedule.html"),
        scripts: resolve(__dirname,"src/js/base.js")
      },
    },
  },
});
