// Obsolete for deprecated
import { Annotations } from './Annotations';

// https://www.npmjs.com/package/@readme/openapi-parser - open api validator
export type DecoratorName =
  | 'Route'
  | 'HttpGet'
  | 'HttpPost'
  | 'HttpPut'
  | 'HttpPatch'
  | 'HttpDelete'
  | 'FromBody'
  | 'FromRoute'
  | 'FromQuery'
  | 'FromHeader'
  | 'IsString'
  | 'Obselete'
  | Annotations;
