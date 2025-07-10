import antfu from "@antfu/eslint-config";
import nextPlugin from "@next/eslint-plugin-next";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default antfu({
  react: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  formatters: true,
  ignores: [
    "next-env.d.ts",
    "convex/README.md",
    "convex/tsconfig.json",
    "convex/_generated/**/*",
  ],
}, jsxA11y.flatConfigs.recommended, {
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
}, {
  files: ["**/*.{jsx,tsx}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    "better-tailwindcss": eslintPluginBetterTailwindcss,
  },
  settings: {
    "better-tailwindcss": {
      entryPoint: "src/styles.css",
    },
  },
  rules: {
    ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
    "better-tailwindcss/enforce-consistent-line-wrapping": "off",
  },
}, {
  rules: {
    "antfu/no-top-level-await": "off",
    "node/prefer-global/process": "off",
  },
});
