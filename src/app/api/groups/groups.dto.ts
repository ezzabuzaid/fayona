import { GroupsSchema } from './group.model';

export interface GroupsDto extends GroupsSchema {
    members: string[];
}