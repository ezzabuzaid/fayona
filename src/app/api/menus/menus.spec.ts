import { superAgent } from '@test/index';
import { Constants, NetworkStatus } from '@core/helpers';

describe('#Get All', () => {
    it('Should return data without token', async (done) => {
        const res = await (await superAgent).get(`/api/${Constants.Endpoints.MENUS}`);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.status).toBe(NetworkStatus.OK);
        done();
    });
});
