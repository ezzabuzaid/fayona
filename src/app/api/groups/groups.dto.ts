import { GroupsSchema } from './group.model';

export interface IGroupsDto extends GroupsSchema {
    members: string[];
}
