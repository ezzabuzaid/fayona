import { CrudService } from './crud.service';
import { Repo } from './crud.repo';
import { ICrudOperation } from './crud.options';
import { DocumentQuery } from 'mongoose';

const MockCrudService = jest.fn<Partial<CrudService<any>>, ConstructorParameters<typeof CrudService>>(() => ({
    create: jest.fn(),
    all: jest.fn()
}));

const MockRepo = jest.fn<Partial<Repo<any>>, ConstructorParameters<typeof Repo>>(() => ({
    fetchAll: jest.fn().mockImplementation(() => new DocumentQuery())
}));

describe('#MockService', () => {
    describe('[ALL]', () => {
        test('should fetch all entites from repo', () => {
            const repo = new MockRepo(null);
            const crudService = new CrudService(repo as any);
            crudService.all({}, {}, {});
            expect(repo.fetchAll).toHaveBeenCalledWith({}, {}, {});
        });
        test('should invoke the hooks', async () => {
            const options: ICrudOperation = {
                all: {
                    post: () => {
                        expect(true).toBeTruthy();
                    },
                    pre: () => {
                        expect(true).toBeTruthy();
                    },
                }
            };
            const documentQuery = new Object();
            const mockRepo: Partial<Repo<any>> = { fetchAll: jest.fn().mockReturnValue(documentQuery) };
            const crudService = new CrudService(mockRepo as any, options);
            await crudService.all();
        });
        test('should return the value', async () => {
            const returnValue = [new Object()];
            const mockRepo: Partial<Repo<any>> = {
                fetchAll: jest.fn().mockReturnValue(Promise.resolve(returnValue))
            };
            const crudService = new CrudService(mockRepo as any);
            expect(await crudService.all()).toEqual(returnValue);
        });
    });
});

// describe('#CrudRouter', () => {
//     test('Test', () => {
//         const options = { query: { species: 'dog' } }

//         it('returns a 200 response', async () => {
//             const { res } = await expressRequestMock(crud.createw, options)
//             expect(res.statusCode).to.equal(200)
//         });
//         // @Router('test')
//         // class TestRouter extends CrudRouter<ITest> {
//         //     constructor() {
//         //         super(new CrudService(new Repo(BaseModel(new Schema()))));
//         //     }
//         // }
//         // Wrapper.registerRouter(TestRouter);
//         expect(true).toBeTruthy();
//     });
// });

// describe('#CrudService', () => {
//     test('Test', () => {
//         const options = { query: { species: 'dog' } }

//         it('returns a 200 response', async () => {
//             const { res } = await expressRequestMock(crud.createw, options)
//             expect(res.statusCode).to.equal(200)
//         });
//         // @Router('test')
//         // class TestRouter extends CrudRouter<ITest> {
//         //     constructor() {
//         //         super(new CrudService(new Repo(BaseModel(new Schema()))));
//         //     }
//         // }
//         // Wrapper.registerRouter(TestRouter);
//         expect(true).toBeTruthy();
//     });
// });
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

// describe('DELETE BY ${id}/', () => {
//     test('Reject request without token', async () => {
//         const res = await superAgent.delete(`${ENDPOINT}/${user.id}`);
//         expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
//     });

//     test('should fail if requested with id not of type ObjectId', async () => {
//         const req = superAgent.delete(`${ENDPOINT}/${undefined}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
//     });

//     test('should fail if requested to non exist entity', async () => {
//         const req = superAgent.delete(`${ENDPOINT}/${new Types.ObjectId()}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
//     });

//     test('resposne payload should equal to', async () => {
//         const req = superAgent.delete(`${ENDPOINT}/${user.id}`);
//         const res = await req.set('Authorization', user.token);
//         const { data } = res.payload;
//         expect(data).toBeNull();
//     });
// });

// describe('GET BY ${id}/', () => {
//     test('Reject request without token', async () => {
//         const res = await superAgent.get(`${ENDPOINT}/${user.id}`);
//         expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
//     });

//     test('should fail if requested with id not of type ObjectId', async () => {
//         // this will rise cast error
//         const req = superAgent.get(`${ENDPOINT}/${undefined}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
//     });

//     test('should fail if requested to non exist entity', async () => {
//         const req = superAgent.get(`${ENDPOINT}/${new Types.ObjectId()}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
//     });

//     test('resposne payload should equal to', async () => {
//         const req = superAgent.get(`${ENDPOINT}/${user.id}`);
//         const res = await req.set('Authorization', user.token);
//         const { data } = res.payload;
//         expect(data).toHaveProperty('username');
//         expect(data).toHaveProperty('email');
//         expect(data).toHaveProperty('mobile');
//         expect(data).toHaveProperty('createdAt');
//         expect(data).toHaveProperty('updatedAt');
//         expect(data).toHaveProperty('_id');
//         // password return, even it returned without being hashing
//         expect(data).not.toHaveProperty('password');
//     });
// });

describe('#GET USER', () => {
    test.todo(`user payload should contain only id`);
});
