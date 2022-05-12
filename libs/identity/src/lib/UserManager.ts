export class UserManager<TUser> {}

export interface IUserManager<TUser> {
  GetUserIdAsync(): Promise<string>;
  GetUserNameAsync(): Promise<string>;
  GetEmailAsync(): Promise<string>;
  GetSecurityStampAsync(): Promise<string>;
  GetClaimsAsync(): Promise<string>;
  GetRolesAsync(): Promise<string[]>;
}
