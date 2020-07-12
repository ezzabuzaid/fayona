module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        "header-max-length": [0, "always", 150],
        "scope-case": [0, "always", "PascalCase"]
    }
};
