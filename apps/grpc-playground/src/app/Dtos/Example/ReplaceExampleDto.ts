import { OpenApiSchema } from '@fayona/openapi';

import { Example } from '../../Models';

export class ReplaceExampleDto {
  @OpenApiSchema({ Description: 'ReplaceExampleDto Name' })
  name!: string;

  @OpenApiSchema({ Description: 'ReplaceExampleDto oldExample' })
  oldExample?: Example;
}
