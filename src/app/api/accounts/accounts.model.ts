import { Field, Entity } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.ACCOUNTS)
export class AccountsModel {
    @Field() firstName: string;
    @Field() lastName: string;
    @Field() city: string;
    @Field() country: string;
    @Field() nationality: string;
    @Field() placeOfBirth: string;
    @Field() dateOfBrith: string;
    @Field() gender: string;
    @Field() occupation: string;
}
