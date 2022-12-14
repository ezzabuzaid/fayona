import { classes } from '@automapper/classes';
import { createMap, createMapper } from '@automapper/core';

import { CreateExampleDto, UpdateExampleDto } from './app/Dtos';
import { Example } from './app/Models';

export const mapper = createMapper({
  strategyInitializer: classes(),
});
createMap(mapper, UpdateExampleDto, UpdateExampleDto);
createMap(mapper, CreateExampleDto, CreateExampleDto);
createMap(mapper, Example, Example);
