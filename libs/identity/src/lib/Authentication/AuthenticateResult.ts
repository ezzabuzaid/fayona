import { ClaimsPrincipal } from '../Claims';
import { AuthenticationTicket } from './AuthenticationTicket';

export interface AuthenticationProperties {}

interface IAuthenticateResultOptions {
  Ticket?: AuthenticationTicket;
  Properties?: AuthenticationProperties;
  Failure?: Error;
  None?: boolean;
}
export class AuthenticateResult {
  #None?: boolean;
  #Failure?: Error;
  #Ticket?: AuthenticationTicket;
  #Properties?: AuthenticationProperties;
  protected constructor(options: IAuthenticateResultOptions) {
    this.#Ticket = options.Ticket;
    this.#Properties = options.Properties;
    this.#Failure = options.Failure;
    this.#None = options.None;
  }
  /**
   * If a ticket was produced, authenticate was successful.
   */
  public get Succeeded(): boolean {
    return this.Ticket != null;
  }

  /**
   * The authentication ticket
   */
  public get Ticket(): AuthenticationTicket | undefined {
    return this.#Ticket;
  }

  /**
   * Gets the claims-principal with authenticated user identities
   */
  public get Principal(): ClaimsPrincipal | undefined {
    return this.#Ticket?.Principal;
  }

  /**
   * Additional state values for the authentication session.
   */
  public get Properties(): AuthenticationProperties | undefined {
    return this.#Properties;
  }
  /**
   * Holds failure information from the authentication
   */
  public get Failure(): Error | undefined {
    return this.#Failure;
  }

  /**
   * Indicates that there was no information returned for this authentication scheme.
   */
  public get None(): boolean | undefined {
    return this.#None;
  }

  public static Success(ticket: AuthenticationTicket): AuthenticateResult {
    if (ticket == null) {
      throw new Error('ArgumentNullException');
    }
    return new AuthenticateResult({
      Ticket: ticket,
      Properties: ticket.Properties,
    });
  }

  /**
   * Indicates that there was no information returned for this authentication scheme.
   */
  public static NoResult(): AuthenticateResult {
    return new AuthenticateResult({ None: true });
  }

  public static Fail(failure: Error): AuthenticateResult;
  public static Fail(
    failure: Error,
    properties?: AuthenticationProperties
  ): AuthenticateResult;
  public static Fail(failureMessage: string): AuthenticateResult;
  public static Fail(
    failureMessage: string,
    properties?: AuthenticationProperties
  ): AuthenticateResult;

  public static Fail(
    failureMessageOrFailure: string | Error,
    properties?: AuthenticationProperties
  ): AuthenticateResult {
    if (typeof failureMessageOrFailure === 'string') {
      return new AuthenticateResult({
        Failure: new Error(failureMessageOrFailure),
        Properties: properties,
      });
    }
    return new AuthenticateResult({
      Failure: failureMessageOrFailure,
      Properties: properties,
    });
  }
}
