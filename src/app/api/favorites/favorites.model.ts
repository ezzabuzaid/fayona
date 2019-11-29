import { Constants } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.favorites)
export class FavoritesSchema {
    @Field() public user_id: Types.ObjectId;
    @Field() public item_id: Types.ObjectId;
    @Field({
        enum: [Constants.Schemas.meals, Constants.Schemas.MENUS]
    }) public type: string;
}
export const FavoritesModel = BaseModel<FavoritesSchema>(FavoritesSchema);
FavoritesModel.schema.virtual('item', {
    ref: (doc) => doc.type,
    localField: 'item_id',
    foreignField: '_id',
    justOne: true
});
