import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: env.VITE_API_HOST,
      port: parseInt(env.VITE_CLIENT_PORT) || 3000,
      strictPort: true,
    },
  };
});
