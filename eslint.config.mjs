import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["api/generated/**", "dist/**", "node_modules/**"],
  },
  {
    files: [
      "app/**/*.{ts,tsx}",
      "helpers/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "stores/**/*.{ts,tsx}",
      "utils/**/*.{ts,tsx}",
      "types/**/*.{ts,tsx}",
      "interfaces/**/*.{ts,tsx}",
      "enums/**/*.{ts,tsx}",
      "__tests__/**/*.{ts,tsx}",
      "*.{ts,tsx}",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {},
  },
];
