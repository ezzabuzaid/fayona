module.exports = {
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["PascalCase"]
      },
      {
        "selector": ["objectLiteralProperty", "objectLiteralMethod"],
        "format": ["PascalCase", "camelCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE", "PascalCase"]
      },
      {
        "selector": ["parameter"],
        "format": ["camelCase"]
      },
      {
        "selector": ["parameterProperty"],
        "format": ["PascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["PascalCase", "UPPER_CASE"]
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/consistent-type-definitions": [
      "error",
      "interface"
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit",
        "overrides": { "constructors": "no-public" }
      }
    ],
    "@typescript-eslint/no-inferrable-types": [
      "error",
      {
        "ignoreParameters": true
      }
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "allow"
      }
    ],
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/member-ordering": [
      "error",
      {
        "default": [
          // Index signature
          "signature",

          // Fields
          "public-static-field",
          "protected-static-field",
          "private-static-field",

          "public-decorated-field",
          "protected-decorated-field",
          "private-decorated-field",

          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",

          "public-abstract-field",
          "protected-abstract-field",
          "private-abstract-field",

          "public-field",
          "protected-field",
          "private-field",

          "static-field",
          "instance-field",
          "abstract-field",

          "decorated-field",

          "field",

          // Constructors
          "public-constructor",
          "protected-constructor",
          "private-constructor",

          "constructor",

          // Methods
          "public-static-method",
          "protected-static-method",
          "private-static-method",

          "public-decorated-method",
          "protected-decorated-method",
          "private-decorated-method",

          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",

          "public-abstract-method",
          "protected-abstract-method",
          "private-abstract-method",

          "public-method",
          "protected-method",
          "private-method",

          "static-method",
          "instance-method",
          "abstract-method",

          "decorated-method",

          "method"
        ]
      }
    ],
  }
};
