import { Injector } from "tiny-injector";
import { Environment } from "../../src/index";

describe('Bootstrap', () => {

    it.each([
        ['development'],
        ['production'],
    ])('checks if env is %s', (env) => {
        // Arrange
        const expected = true;
        process.env.NODE_ENV = env;

        // Act
        const actual = Injector.GetRequiredService(Environment);

        // Assert
        expect(actual.EnvironmentName === env).toEqual(expected);
    });

});
