import { nanoid } from 'nanoid';
import { Injectable, ServiceLifetime } from 'tiny-injector';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class RequestIdOptions {
  public SetHeader = false;
  public HeaderName = 'X-Request-Id';
  public Generator = (): string => nanoid();
}
