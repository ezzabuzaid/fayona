# Node Buildozer (The Node version of . NetCore)

  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ezzabuzaid/document-storage/pulls) 

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

**A small opinionated framework built on top of Express using Typescript that will help you to easily kick off your project to the world**

### Highlights

1. Database independent, doesn't matter what you use!
2. Errors are handled gloably so you catch when you need to know why that occured
3. Service errors are handled by the route itself, unless you want to throw custom exception you don't need to do any error handling. default status is `Bad Request`
4. Api folder is an example of how you can utilize the functionality

#### Packages

| Package                   | Description                                                                         
| ------------------------- | ----------------------------------------------------------------------------------- |
| `@lib/translation` | Translation library that helps you to switch from language to another
| `@lib/restful` | Set of typescript decorator for easily register HTTP routes handler 
| `@lib/mongoose` | Set of typescript decorator for mapping fields and schema
| `@lib/locator` | Simple service locator

#### Attributes

| Attribute                   | Description                                                                         
| ------------------------- | ----------------------------------------------------------------------------------- |
| `Route` | explicty mark the handler to specific endpoint
| `FromBody` | retrive the body from the incoming requst and implictly validate it if possible
| `FromQuery` | retrive query params/param from Uri
| `FromParams` | retrive specific param from Uri
| `FromHeaders` | retrive header name from the request
| `AllowAnonymous` | Mark the route to be authentication free
| `identity.Authorize(Roles?)` | Prevent access to a route if the user is not authenticated or have the desired role
| `ContextResponse` | Get current http context **Response**
| `ContextRequest` | Get current http context **Request**
| `HttpPost` | Mark the handler as HTTP POST request handler
| `HttpGet` | Mark the handler as HTTP GET request handler
| `HttpPut` | Mark the handler as HTTP PUT request handler
| `HttpDelete` | Mark the handler as HTTP DELETE request handler
| `HttpPatch` | Mark the handler as HTTP PATCH request handler

## Contributing

Don't hesitate to open issues and make a pull request to help improve code

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Developer

##### [Ezzabuzaid](mailto:ezzabuzaid@hotmail.com)

* [Dev.to](https://dev.to/ezzabuzaid)
* [GitHub](https://github.com/ezzabuzaid)
* [Linkedin](https://www.linkedin.com/in/ezzabuzaid)

## License

##### The MIT License (MIT)

##### Built with love <3
