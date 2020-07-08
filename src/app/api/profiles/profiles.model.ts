import { Field, Entity } from '@lib/mongoose';
import { Constants } from '@core/helpers';

export enum EGender {
    Male,
    Female
}
@Entity(Constants.Schemas.PROFILES)
export class ProfilesSchema {
    @Field() firstName: string;
    @Field() lastName: string;
    @Field() nationality: string;
    @Field() placeOfBirth: string;
    @Field() dateOfBrith: Date;
    @Field({
        enum: Object.keys(EGender).filter(_ => !isNaN(+_)).map(_ => +_),
    }) gender: EGender;
    @Field({ required: false }) country: string;
    @Field({ required: false }) city: string;
    @Field({ required: false }) occupation: string;
}
