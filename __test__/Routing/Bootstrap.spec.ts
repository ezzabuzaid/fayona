import { isEnv } from "../../src";

describe('Bootstrap', () => {

    it.each([
        ['development'],
        ['production'],
    ])('checks if env is %s', (env) => {
        // Arrange
        const expected = true;
        process.env.NODE_ENV = env;

        // Act
        const actual = isEnv(env);

        // Assert
        expect(actual).toEqual(expected);
    });

});
