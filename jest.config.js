const tsconfig = require("./tsconfig.json");

const fromPairs = pairs => pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {});

const resolvedPathes = Object
  .entries(tsconfig.paths)
  .map(([key, [value]]) => [key.replace(/\*/, "(.*)"), `<rootDir>/${tsconfig.baseUrl}/${value.replace(/\*/, "$1")}`,])

const moduleNameMapper = fromPairs(resolvedPathes)

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
