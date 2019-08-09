import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Types, models, modelNames } from 'mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.favorites)
export class FavoritesSchema {
    @Field({ lowercase: false }) public user_id: Types.ObjectId;
    @Field({ lowercase: false }) public item_id: Types.ObjectId;
    @Field({
        enum: [Constants.Schemas.meals, Constants.Schemas.menus]
    }) public type: string;

    // @Virtual('assigned', {
    //     ref: doc => doc.type,
    //     localField: 'item_id',
    //     foreignField: '_id',
    //     justOne: false
    // })
    // t(){}
}
export const FavoritesModel = BaseModel<FavoritesSchema>(FavoritesSchema);
FavoritesModel.schema.virtual('items', {
    ref: (doc) => doc.type,
    localField: 'item_id',
    foreignField: '_id',
    justOne: true
});
