import { BaseModel, Entity, Field } from '@lib/mongoose';
@Entity('authors')
export class AuthorsModel extends BaseModel {
    @Field({ unique: true }) name_en: string;
    @Field({ unique: true }) name_ar: string;
    @Field() description: string;
    @Field() image: string;
}
