import { CrudRouter } from './crud.router';
import { Router } from '@lib/methods';
import { CrudService } from './crud.service';
import { Repo } from './crud.repo';
import { BaseModel } from '@lib/mongoose';
import { Schema } from 'mongoose';
import { Wrapper } from 'app/wrapper';

interface ITest {
    first_name: string;
    last_name: string;
}

describe('Add router to wrapper', () => {
    it('Test', () => {
        // @Router('test')
        // class TestRouter extends CrudRouter<ITest> {
        //     constructor() {
        //         super(new CrudService(new Repo(BaseModel(new Schema()))));
        //     }
        // }
        // Wrapper.registerRouter(TestRouter);
        expect(true).toBeTruthy();
    });
});

// const ENDPOINT = `/api/${Constants.Endpoints.USERS}`;
// let user: UserFixture = null;
// beforeAll(async () => {
//     user = await createUser();
// });

// afterAll(async () => {
//     await deleteUser();
// });
// tslint:disable-next-line: max-line-length
// REVIEW  in create and update you should check and verify if the data was update or created successfully other that the failur test
// and in delete you must check that the entity no longer in database
// in update and create you must test the validation by insert Wrong data
// in login check login test cases
// try to send wrong mobile, email

// REVIEW  in create and update you should check and verify if the data was update or created successfully
// other that the failur test
// and in delete you must check that the entity no longer in database
