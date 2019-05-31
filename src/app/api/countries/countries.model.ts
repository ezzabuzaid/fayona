// import { BaseModel, Entity, Field } from '@lib/mongoose';

// @Entity('countries')
// export class CountriesModel extends BaseModel {
//     @Field({ unique: true }) placeId: string;
//     @Field() name_en: string;
//     @Field() name_ar: string;
// }


// // type ExcludeTypeKey<K, T> = typeof K extends T ? never : K
// // type ExcludeTypeField<A, T> = { [K in ExcludeTypeKey<A, T>]: A[K] }

// // const x: ExcludeTypeField<CountriesModel, typeof BaseModel> = null;