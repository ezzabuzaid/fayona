import { Router, Post } from '@lib/methods';
import { Constants, tokenService } from '@core/helpers';
import { CrudRouter } from '@shared/crud';
import { GroupsSchema } from './group.model';
import groupService from './group.service';
import { Request } from 'express';
import { Auth } from '@api/portal';

@Router(Constants.Endpoints.GROUPS)
export class GroupsRouter extends CrudRouter<GroupsSchema> {
    constructor() {
        super(groupService);
    }

    @Post('/', Auth.isAuthenticated)
    public async create(req: Request, res) {
        // const dto = new GroupsSchema(req.body);
        // const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        // dto.members.push({ user_id: decodedToken.id, isAdmin: true });
        // req.body = dto;
        return super.create(req, res);
    }

}
