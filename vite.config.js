import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite"; // Added loadEnv here
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// Pass a callback function to defineConfig to access the mode and safely load env vars
export default defineConfig(({ mode }) => {
    // Load env file based on the current mode (development, production, etc.)
    const env = loadEnv(mode, process.cwd(), '');

    // Fallback to localhost:8080 if VITE_API_URL isn't set in your .env file
    const targetUrl = env.VITE_API_URL || "http://localhost:8080/";

    return {
        plugins: [vue(), vueDevTools()],
        server: {
            proxy: {
                "/api": {
                    target: targetUrl, // Now dynamically maps to your .env variable safely!
                    changeOrigin: true,
                    // Renamed parameter to 'p' to fix your original "unused parameter" lint warning
                    rewrite: (p) => p.replace(/^\/api/, ""),
                },
            }
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    };
});