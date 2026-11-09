import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: [
      "**/node_modules/**",
      "**/.direnv/**",
      "**/.next/**",
      "**/build/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".direnv/**",
        ".next/**",
        "vitest.config.ts",
        "vitest.setup.ts",
        "next.config.js",
        "next-env.d.ts",
        "components/saveToFile.ts",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
