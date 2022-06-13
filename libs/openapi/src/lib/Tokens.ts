import { InjectionToken } from 'tiny-injector';
import * as ts from 'typescript';

import { IOptions } from './IOptions';

export const OPTIONS_TOKEN = new InjectionToken<IOptions>('Token For OPTIONS');
export const SOURCE_FILE_TOKEN = new InjectionToken<ts.SourceFile>(
  'Token For SOURCE_FILE'
);
export const PROGRAM_TOKEN = new InjectionToken<ts.Program>(
  'Token For PROGRAM'
);
export const CHECKER_TOKEN = new InjectionToken<ts.TypeChecker>(
  'Token For TS CHECKER'
);
