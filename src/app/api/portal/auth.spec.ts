import { generateToken } from '@test/fixture';
import { ApplicationConstants } from '@core/constants';

xdescribe('[isAuth]', () => {
    test('the request does not contain device_uuid', async () => {
        global.superAgent.get('/').set({
            [ApplicationConstants.deviceIdHeader]: null,
            authorization: generateToken()
        });
    });
});
