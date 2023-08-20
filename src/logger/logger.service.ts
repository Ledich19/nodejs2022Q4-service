import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { appendFile, mkdir, access, stat, rename, readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { ConfigService } from '@nestjs/config';

const blue = (text) => `\x1b[34m${text}:\x1b[32m`;
const red = (text) => `\x1b[31m${text}:\x1b[32m`;

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  private logFileName: string;
  private errorFileName: string;
  private logFilePath: string;
  private workDir: string;
  private maxLogFileSize: number;

  constructor(private configService: ConfigService) {
    super();
    this.logFileName = 'logs.log';
    this.errorFileName = 'errors.log';
    this.workDir = join(dirname(this.logFileName), 'logs/');
    this.logFilePath = join(this.workDir, this.logFileName);
    this.maxLogFileSize = this.configService.get('logs.size') * 1024;
  }

  private async rotateLogFileIfNeeded() {
    try {
      const stats = await stat(this.logFilePath);
      if (stats.size < this.maxLogFileSize) {
        return;
      }
      const existingLogFiles = await readdir(this.workDir);
      const logFiles = existingLogFiles.filter(
        (file) => file.startsWith('logs_') && file.endsWith('.log'),
      );
      const max = Math.max(
        ...logFiles
          .map((el) => parseInt(el.substring(5, 7), 10))
          .filter((value) => !isNaN(value)),
        0,
      );
      const newLogFileName = `logs_${
        max + 1 < 10 ? `0${max + 1}` : max + 1
      }.log`;
      const newLogFilePath = join(this.workDir, newLogFileName);
      await rename(this.logFilePath, newLogFilePath);
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  private async ensureDirectoryExists(path: string) {
    try {
      await access(path);
    } catch {
      await mkdir(path);
    }
  }

  private async write(sign, data) {
    await this.ensureDirectoryExists(this.workDir);
    await this.rotateLogFileIfNeeded();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${sign}] ${data}\n`;
    await appendFile(this.logFilePath, logMessage, {
      encoding: 'utf8',
      flag: 'a',
    });
    if (sign === 'ERROR') {
      const logMessage = `[${timestamp}] ${data}\n`;
      appendFile(join(this.workDir, this.errorFileName), logMessage, {
        encoding: 'utf8',
        flag: 'a',
      });
    }
  }

  async error(message: string, trace: string) {
    this.write('ERROR', message);
    super.error(message, trace);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.write('WARN', message);
    super.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.write('DEBUG', message);
    super.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.write('VERBOSE', message);
    super.verbose(message, ...optionalParams);
  }

  async logRequest(
    url: string,
    method: string,
    queryParameters: any,
    body: any,
  ) {
    const stringQuery = await JSON.stringify(queryParameters);
    const stringBody = await JSON.stringify(body);

    this.write(
      'REQUEST',
      `URL: ${url}, Method:${method},Query Parameters: ${stringQuery}, Body: ${stringBody}`,
    );

    this.log(
      `${blue('URL')} ${url}, ${blue('Method')} ${method}, ${blue(
        'Query Parameters',
      )} ${JSON.stringify(queryParameters)}, ${blue('Body')} ${JSON.stringify(
        body,
      )}`,
    );
  }
  logResponse(statusCode: string) {
    this.write('RESPONSE', `Status Code: ${statusCode}`);
    this.log(`Outgoing response - ${blue('Status Code')} ${statusCode}`);
  }
}
