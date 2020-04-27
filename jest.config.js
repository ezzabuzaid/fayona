const { compilerOptions: { baseUrl, paths } } = require("./tsconfig.json");
const fromPairs = pairs => pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {})
const moduleNameMapper = fromPairs(Object.entries(paths).map(([k, [v]]) => [k.replace(/\*/, "(.*)"), `<rootDir>/${baseUrl}/${v.replace(/\*/, "$1")}`,]))

module.exports = {
  roots: ["./src"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper,
  testEnvironment: "node",
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  bail: true
}