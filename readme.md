# Fayona (The Node version of . NetCore)

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

**Documention not ready as of yet, the below details is high abstract of what the library provide**

although I'm using this library in the side/demo projects, still **The whole thing here is showcase so don't risk anyone by counting too much on it!**

## Motivation

I was so jealous from . NetCore back then, so I decided to make Node. Js version of it ^^

At some point, we needed Node.js for a particular thing and my colleagues have been using . NetCore for always, so I thought it would be nice to make the functions and classes look familiar to reduce the learning curve for them

## Getting Started

1. Create `Application` class and extend `Fayona` class
2. Invoke `UseControllers` instance method to register the controllers
3. `UseControllers` accept callback with registry instance
4. Invoke `UseEndpoints` to configure routes/endpoints options
5. you can use `UseErrorHandler` to catch any unhandled application error

``` typescript
export class Application extends Fayona {
    constructor() {
        this.UseControllers((registry) => {
            registry.addController(UserController);
            registry.addController(ActivityController);
        });

        this.UseEndpoints((endpointOptions) => {
            endpointOptions.prefix = '/api';
        })

        this.UseErrorHandler(globalErrorHandler);
    }
}
```

### Define Controllers

``` typescript

@Route('users')
export class UserController {
    service = locate(UserService);

    @HttpGet('', identity.Authorize(Role.ADMIN))
    async  getAllUsers(@FromQuery(Pagination) pagination: Pagination) {
        const users = await this.service.getAll(pagination);
        return users;
    }

    @HttpGet('search', identity.Authorize())
  public searchForUser(@FromQuery(SearchForUsersQuery) dto: SearchForUsersQuery) {
        return this.service.searchForUsers(dto);
    }

    @HttpGet(':id', identity.Authorize(Role.ADMIN))
    public get(@FromParams('id') id: string) {
        return this.service.getById(id);
    }

    @HttpPost('')
    async createUser(@FromBody(CreateUserDto) dto: CreateUserDto) {
        // you don't need to handle any error in service.create method, you catch all up in UseErrorHandler, typically create entity method will be called a lot and in most cases you'll return the same exception or doing same null checking therefore you can handle it all once by just letting them.  
        await this.service.create(dto);
        return new SuccessResponse('Created');
    }

}
```

`Application` class contains express instance, so you can fallback to it in any case.

Still there's a lot to be written, this is just for demonstration sake.

### Modules

| Module                   | Description
| ------------------------- | ----------------------------------------------------------------------------------- |
| `translation` | Translation library that helps you to switch from language to another
| `routing` | Set of decorators to facilitate declaring HTTP actions
| `locator` | Simple service locator implementation
| `identity` | Simple service locator implementation (Under Development)

#### Routing Decorators/Attributes

| Attribute | Description
| --------- | ----------------------------------------------------------------------------------- |
| `Route` | explicty mark the handler to specific endpoint
| `FromBody` | retrive the body from the incoming requst and implictly validate it if possible
| `FromQuery` | retrive query params/param from Uri
| `FromParams` | retrive specific param from Uri
| `FromHeaders` | retrive header name from the request
| `ContextResponse` | Get current http context **Response**
| `ContextRequest` | Get current http context **Request**
| `HttpPost` | Mark the handler as HTTP POST request handler
| `HttpGet` | Mark the handler as HTTP GET request handler
| `HttpPut` | Mark the handler as HTTP PUT request handler
| `HttpDelete` | Mark the handler as HTTP DELETE request handler
| `HttpPatch` | Mark the handler as HTTP PATCH request handler
----

#### Identity Decorators/Attributes

| Attribute | Description
| ----------- | ----------------------------------------------------------------------------------- |
| `AllowAnonymous` | Mark the route to be authentication free
| `identity.Authorize(...Roles?)` | Prevent access to a route or route action if the user is not authenticated or have the desired role
| `identity.Authenticated()` | Prevent access to a route or route action if the user is not authenticated
----

#### Locator Decorators/Attributes

| Attribute | Description
| ----------- | ----------------------------------------------------------------------------------- |
| `Singelton` | Provide one instance of the marked class throught the application lifetime
| `Factory` | Create new instance for each call made by `locate(ClassName)`

| `Transient` | (Under Development)

### Api

* `@Route(endpoint: string, options?: IRouterDecorationOption)`

is the escence of this library, it will route all the requests to the givin path and will execute the handler that match the final endpoint

``` typescript

@Route('examples')
class ExampleController {
}

```

### Classes

``` typescript
export interface IRouterDecorationOption extends RouterOptions {
    /**
     * Register child route under the parent prefix
     * 
     * e.g:
     * 
     * @Route('restaurants', {
     *  children: [MealController]
     * })
     * class RestaurantController {}
     * 
     * 
     * @Route('meals')
     * class MealController {}
     * 
     * so in order to hit the meals, you will call `restaurants/meals`
     * 
     * Note: you mustn't explicty register ChildController via AddController method in startup configuration
     */
    children?: any[];

    /**
     * Set of middleware will be executed before calling the final end point
     * 
     * e.g: identity.Authorize()
     */
    middleware?: RequestHandler[] | RequestHandlerParams[];
}
```

## Contributing

Don't hesitate to open issues and make a pull request to help improve code

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Developer

**[Ezzabuzaid](mailto:ezzabuzaid@hotmail.com)**

* [Dev.to](https://dev.to/ezzabuzaid)
* [GitHub](https://github.com/ezzabuzaid)
* [Linkedin](https://www.linkedin.com/in/ezzabuzaid)

## License

**The MIT License (MIT)**

**Built with love <3**
