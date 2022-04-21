export abstract class IAuthenticationHandlerProvider {
  public abstract HandleRequestAsync(): boolean;
}
