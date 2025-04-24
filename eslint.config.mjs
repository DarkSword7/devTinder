import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

// add cofig for eslint(no-undef)

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: { "no-undef": "off" },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);
