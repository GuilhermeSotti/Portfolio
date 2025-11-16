module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off"
  }
};
