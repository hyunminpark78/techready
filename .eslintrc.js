module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src/"]],
        extensions: [".js", ".vue"]
      }
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
  ],
  rules: {
    // "no-console": "warn",
    "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-debugger": "warn",
    "no-useless-escape": "off",
    "no-unused-vars": "warn",
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto",
      }
    ]
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
