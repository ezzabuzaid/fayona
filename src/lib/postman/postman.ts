import { writeFileSync } from 'fs';
import { Collection, Header, Item, ItemGroup, Request, RequestBody, Response, Url, Variable } from 'postman-collection';

/*

    @Postman({

    })

    @Folder({
        description: "Test description",
        info: {
            name: "Test collection"
        },
    })

*/

const myCollection = new Collection({
    description: 'Test description',
    info: {
        name: 'Test collection'
    },
    item: [
        new ItemGroup({
            name: 'Users',
            description: 'This collection to utilize users api',
            item: [
                {
                    name: 'Register',
                    description: 'Create a new user',
                    request: new Request({
                        url: new Url({ host: '{{api}}', path: 'users' }),
                        method: 'POST',
                        header: new Header({
                            key: 'Auth',
                            value: 'Auth value',
                            name: 'Authenticaion',
                        }),
                        body: new RequestBody({ raw: '', mode: 'raw' })
                    }),
                    responses: [
                        new Response({
                            code: null,
                            // header?: HeaderDefinition[];
                            // cookie?: CookieDefinition[];
                            body: 'string',
                            responseTime: null,
                            originalRequest: null,
                        })
                    ]
                }
            ]

        })
    ],
    variable: new Variable({
        variableOne: new Variable({ key: '', value: '', type: '' }),
        variableTwo: new Variable({ key: '', value: '', type: '' })
    })
});

writeFileSync('myCollection.postman_collection.json', JSON.stringify(myCollection, null, 2));

export default JSON.stringify(myCollection, null, 2);
