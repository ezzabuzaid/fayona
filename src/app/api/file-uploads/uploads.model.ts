import { Entity, Field, BaseModel } from "@lib/mongoose";

@Entity(name)
export class UploadsSchema {
    @Field() type: string;
    @Field() size: number;
    @Field() name: string;
    @Field() url: string;
}

export const UploadsModel = BaseModel(UploadsSchema);
