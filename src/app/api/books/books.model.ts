import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Schema } from 'mongoose';
// import { AuthorsModel } from '@api/authors';
@Entity('books')
export class BooksModel extends BaseModel {
    @Field({ unique: true }) name_en: string;
    @Field({ unique: true }) name_ar: string;
    @Field() rate: number;
    @Field() image: string;
    @Field({ ref:'' }) author_id: Schema.Types.ObjectId
}
