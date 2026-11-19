import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".build/**",
      ".wrangler/**",
      "test-results/**",
      "playwright-report/**",
      "node_modules/**",
    ],
  },
  ...tseslint.configs.recommended,
);
