import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/erp-business-operations/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
