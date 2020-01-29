import { getRequest } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';

describe('#Get All', () => {
    it('Should return data without token', async () => {
        const response = await getRequest(Constants.Endpoints.MEALS);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.status).toBe(NetworkStatus.OK);
    });
});

describe('#Get Meals by Menu ID', () => {
    it.todo('Should if fail if the menu does not exist');
    it.todo('Should works without JWT token');
});
