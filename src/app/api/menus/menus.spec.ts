import { getRequest } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';

describe('#Get All', () => {
    it('Should return data without token', async () => {
        const response = await getRequest(Constants.Endpoints.MENUS);
        // expect(response.body.data).toBeInstanceOf(Array);
        expect(response.status).toBe(NetworkStatus.OK);
    });
});
