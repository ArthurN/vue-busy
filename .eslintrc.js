module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: [
    "*config.js", // in root dir
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "max-len": [ "warn", { code: 150, } ],
    "indent": "off",
    "@typescript-eslint/indent": [
      "warn",
      2,
      {
        FunctionDeclaration: {
          parameters: "first",
        },
        FunctionExpression: {
          parameters: "first",
        },
        MemberExpression: "off",
        SwitchCase: 1
      },
    ],
  },
  overrides: [
    {
      files: [
        "**/tests/**/*.test.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
