import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import securityPlugin from "eslint-plugin-security";

export default [
  {
    files: ["src/**/*.ts", "src/**/*.js"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      security: securityPlugin,
    },
    rules: {
      // Рекомендованные правила TypeScript
      ...typescriptPlugin.configs.recommended.rules,
      // Рекомендованные правила безопасности
      ...securityPlugin.configs.recommended.rules,

      // Дополнительные правила безопасности
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-eval-with-expression": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "warn",
      "security/detect-new-buffer": "error",
      "security/detect-unsafe-regex": "warn",

      // Смягчения для TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
    },
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".scannerwork/**",
      "fuzz/**",
    ],
  },
];
