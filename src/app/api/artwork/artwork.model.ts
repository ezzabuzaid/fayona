import { BaseModel, Entity, Field } from '@lib/mongoose';

@Entity('artworks')
export class ArtworksSchema {

    @Field() public name: string;
    @Field() public image: string;
    @Field() public status: string;
}

export const ArtworksModel = BaseModel<ArtworksSchema>(ArtworksSchema);
