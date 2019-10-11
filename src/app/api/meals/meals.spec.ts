import { superAgent } from '@test/index';
import { Constants, NetworkStatus } from '@core/helpers';

describe('#Get All', () => {
    it('Should return data without token', async () => {
        const res = await (await superAgent).post(`/api/${Constants.Endpoints.MEALS}`);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.status).toBe(NetworkStatus.OK);
    });
});

describe('#Get Meals by Menu ID', () => {
    it.todo('Should if fail if the menu does not exist');
    it.todo('Should works without JWT token');
});
