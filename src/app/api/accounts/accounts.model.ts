import { Field, Entity, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';

// FIXME should be subddocument within user schema
@Entity(Constants.Schemas.ACCOUNTS)
export class AccountsSchema {
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

export default BaseModel(AccountsSchema);
