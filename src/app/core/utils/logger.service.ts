import colors = require('ansi-colors');

/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { Logger } from 'app/core/utils/logger.service';
 *
 * const log = new Logger('myFile');
 * ...
 * log.debug('something happened');
 * ```
 *
 * To disable debug and info logs in production, add this snippet to your root component:
 * ```
 *
 *     if (environment.production) {
 *       Logger.enableProductionMode();
 *     }
 *
 *
 * If you want to process logs through other outputs than console, you can add LogOutput functions to Logger.outputs.
 */

/**
 * The possible log levels.
 * LogLevel.Off is never emitted and only used with Logger.level property to disable logs.
 */
export enum LogLevel {
  Off = 0,
  Error,
  Warning,
  Info,
  Debug
}

/**
 * Log output handler function.
 */
export type LogOutput = (source: string, level: LogLevel, ...objects: any[]) => void;

export class Logger {
  /**
   * Current logging level.
   * Set it to LogLevel.Off to disable logs completely.
   */
  static level = LogLevel.Debug;

  static outputs: LogOutput[] = [];

  static enableProductionMode() {
    Logger.level = LogLevel.Warning;
  }

  constructor(private source?: string) {
    this.log(console.log, LogLevel.Info, [colors.bold(source)]);
  }

  debug(...objects: any[]) {
    this.colorizeText(objects, 'cyan');
    this.log(console.log, LogLevel.Debug, objects);
  }

  info(...objects: any[]) {
    this.colorizeText(objects, 'green');
    this.log(console.info, LogLevel.Info, objects);
  }

  warn(...objects: any[]) {
    this.colorizeText(objects, 'yellow');
    this.log(console.warn, LogLevel.Warning, objects);
  }

  error(...objects: any[]) {
    this.colorizeText(objects, 'red');
    this.log(console.error, LogLevel.Error, objects);
  }

  private log(func: Function, level: LogLevel, objects: any[]) {
    if (level <= Logger.level) {
      const log = this.source ? ['[' + colors.bgBlack(colors.bold(this.source)) + ']'].concat(objects) : objects;
      func.apply(console, log);
      Logger.outputs.forEach(output => output.apply(output, [this.source, level].concat(objects)));
    }
  }

  private colorizeText(objects: any[], color) {
    objects.forEach((el, index) => {
      if (typeof el === 'string') {
        objects[index] = colors[color](el);
      }
    });
  }

}
