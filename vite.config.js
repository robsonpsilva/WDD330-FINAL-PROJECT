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
        hikingmap: resolve(__dirname,"src/hiking-map/hiking-map.html"),
        home: resolve(__dirname, "src/home.html"),
        base: "src/js/base.js",
        cart: "src/js/cart.js",
        hiking: "src/js/hiking-map.js",
        products: "src/js/products.js",
        purchase: "src/js/purchase.js",
        scheduler: "src/js/scheduler.js",
        thanks: "src/js/thanks.js",
        loginjs: "src/js/login.js",
        getdates: "src/js/getdates.js"
      },
    },
  },
});
