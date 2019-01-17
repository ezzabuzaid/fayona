// import { Schema, model } from "mongoose";
// import { CustomersRouter, SubCustomersRouter } from "./customers.routes";

// function Wrapper(configuration) {
//     return function (target) { }
// }

// @Wrapper({
//     models: [],
//     routes: [
//         {
//             path: 'customers', guard: ['or middleware'], router: CustomersRouter, children: [
//                 { path: 'sub', router: SubCustomersRouter }
//             ]
//         }
//     ]
// })
// export class CustomersModule { }

// // Why i need to create a new mongoose model instance ?????
// // inject the wrapper class into sub router and assign it
// // inject the wrapper class mean retrive the injector that hold the class instance

// // ask about this type of defining routes path and it's children or by injection style or by calling it
// // explicity Wrapper.assginTo(superRouter, router) | Wrapper.assginTo(superRouter, subSuperRouter, router)


// // # resolve all route like urlSegment angular


// // Both style must be implemented the angular style, and Wrapper style

// // does he really need this style ?
// // what about he just wanna to use one RouterClass
// // should just user @Router and define path there
// // and about the guard(middleware) just add them when you define router to easy setup
// // i think that this should be used when you add more than just path and router

// // when you wanna to set a list of dependencies because he inject them in router classs
// // constructor(private one: One){}
// // { path: 'customers', deps: [One] }
// // try to make use of angular way by injecting it directly

// // Take care of error handling