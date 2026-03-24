import coreWebVitals from "eslint-config-next/core-web-vitals"

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitals,
  {
    rules: {
      // Next 16 enables strict React Compiler rules; this codebase uses common
      // data-fetch-in-useEffect and UI sync patterns that trip these checks.
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
]

export default eslintConfig
