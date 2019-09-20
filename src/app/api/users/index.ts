import { Repo } from '@core/contracts/repo';
import { UsersSchema, UsersModel } from './users.model';
export const usersRepo = new Repo<UsersSchema>(UsersModel);

export * from './users.model';
export * from './users.routes';
export * from './users.service';
export * from './users.spec';
