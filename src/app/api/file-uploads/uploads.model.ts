import { Entity, Field, BaseModel } from '@lib/mongoose';

@Entity(name)
export class UploadsSchema {
    @Field() public type: string;
    @Field() public size: number;
    @Field() public name: string;
    @Field() public url: string;
}

export const UploadsModel = BaseModel(UploadsSchema);
