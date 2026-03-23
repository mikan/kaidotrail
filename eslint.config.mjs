import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
  jsdoc.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, jsdoc },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "off",
      "jsdoc/reject-any-type": "off",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  eslintConfigPrettier,
]);
