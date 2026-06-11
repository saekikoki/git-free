// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  //本番用では不要
  server: {
    proxy: {
      "/api": {
        target: "https://dx6lry7zfa.execute-api.ap-northeast-3.amazonaws.com/prod",
        changeOrigin: true
      }
    }
  }
  //ここまで
});