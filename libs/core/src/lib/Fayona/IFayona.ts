/* eslint-disable @typescript-eslint/prefer-function-type */
/* eslint-disable @typescript-eslint/no-misused-new */
export interface IFayonaOptions {}
export interface IFayona {
  Options: IFayonaOptions | undefined;
  new (options?: IFayonaOptions): IFayona;
}
