


// @Singelton()
// export class NestedSingeltonClass {
//     id = Math.random();

// }
// @Singelton()
// export class SingeltonClass {
//     id = Math.random();

//     constructor(
//         public child: NestedSingeltonClass
//     ) { }
// }

// @Scoped()
// export class NestedScopedClass {
//     id = Math.random();
// }

// @Scoped()
// export class ScopedClass {
//     id = Math.random();
//     constructor(
//         public singelton: NestedSingeltonClass,
//         public scoped: NestedScopedClass,
//     ) { }
// }

// (function run() {
//     // const i = locate(SingeltonClass);
//     // console.log('id', i.id);
//     // console.log('child id', i.child.id);
//     ServiceLocator.createScope((context) => {
//         const one = locate(ScopedClass, context);
//         const nestedOne = locate(NestedScopedClass);
//         // const two = provider(NestedScopedClass);
//         // const s = provider(SingeltonClass);
//         console.log(one.id);
//         console.log(one.scoped.id);
//         console.log(nestedOne.id);
//         console.log(one.singelton.id);
//         // console.log(one.singelton.id);
//         // console.log(two);
//         // console.log(s);
//         // console.log(s.child);
//     });

// })()

// // locate.of(this)

// /**
//  * The Intent
//  *
//  * Using locate(Singeltion) from every where
//  * Using locate(Transiant) from every where
//  * Using locate(Transiant) from every where
//  */
