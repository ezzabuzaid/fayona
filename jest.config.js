const { compilerOptions: { baseUrl, paths } } = require("./tsconfig.json");
const fromPairs = pairs => pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {})
const moduleNameMapper = fromPairs(Object.entries(paths).map(([k, [v]]) => [k.replace(/\*/, "(.*)"), `<rootDir>/${baseUrl}/${v.replace(/\*/, "$1")}`,]))

module.exports = {
  roots: ["./src"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper,
  testEnvironment: "<rootDir>/src/test/custom-test-env.js",
  // testEnvironment: 'node'
  // globalSetup: "<rootDir>/test/setup.ts",
  // globalTeardown: "<rootDir>/test/teardown.ts",
}
