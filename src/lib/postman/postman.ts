import { writeFileSync } from 'fs';
import { Collection, RequestBody, Variable, Header, Url } from 'postman-collection';

const myCollection = new Collection({
    description: "Test description",
    info: {
        name: "Test collection"
    },
    item: [
        {
            name: 'Users',
            description: 'This collection to utilize users api',
            item: [
                {
                    name: "Register",
                    description: "Create a new user",
                    request: {
                        url: new Url({ host: "{{api}}", path: "users" }),
                        method: "POST",
                        header: new Header({
                            key: "Auth",
                            value: "Auth value",
                            name: "Authenticaion",
                        }),
                        body: new RequestBody({ raw: '', mode: 'raw' })
                    }
                }
            ]
        }
    ],
    variable: new Variable({
        variableOne: new Variable({ key: "", value: "", type: "" }),
        variableTwo: new Variable({ key: "", value: "", type: "" })
    }
    ),
});

writeFileSync('myCollection.postman_collection.json', JSON.stringify(myCollection, null, 2));

export default JSON.stringify(myCollection, null, 2);