import { superAgent } from '@test/index';
import { Constants, NetworkStatus } from '@core/helpers';

describe('#Get All', () => {
    it('Should return data without token', async () => {
        const res = await (await superAgent).post(`/api/${Constants.Endpoints.MENUS}`);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.status).toBe(NetworkStatus.OK);
    });
});
