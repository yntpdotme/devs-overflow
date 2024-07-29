import {FlatCompat} from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {configs as tsConfigs} from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
  allConfig: eslintJs.configs.all,
});

const tsFiles = ["**/*.ts", "**/*.tsx"];

const customTypescriptConfig = {
  files: tsFiles,
  plugins: {
    import: importPlugin,
    "import/parsers": tsParser,
  },
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
  },
  rules: {
    "import/export": "error",
    "import/no-duplicates": "warn",
    ...importPlugin.configs.typescript.rules,
    "@typescript-eslint/no-use-before-define": "off",
    "require-await": "off",
    "no-duplicate-imports": "error",
    "no-unneeded-ternary": "error",
    "prefer-object-spread": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        args: "none",
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "object",
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "@app/**",
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

const recommendedTypeScriptConfigs = [
  ...tsConfigs.recommended.map(config => ({
    ...config,
    files: tsFiles,
  })),
  ...tsConfigs.stylistic.map(config => ({
    ...config,
    files: tsFiles,
  })),
];

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ),
  ...recommendedTypeScriptConfigs,
  customTypescriptConfig,
  {
    rules: {
      "no-undef": "off",
      camelcase: [
        "error",
        {
          allow: ["Geist_Mono"],
        },
      ],
    },
  },
];

export default config;
