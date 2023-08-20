import {
  Injectable,
  Scope,
  ConsoleLogger,
  LoggerService,
} from '@nestjs/common';

import { appendFile, mkdir, access, stat, rename, readdir } from 'fs/promises';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

//const filePath = new URL('./files/fileToWrite.txt', import.meta.url);

const blue = (text) => `\x1b[34m${text}:\x1b[32m`;
const red = (text) => `\x1b[31m${text}:\x1b[32m`;

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  private logFileName: string;
  private logFilePath: string;
  private maxLogFileSize: number;

  constructor() {
    super();
    this.logFileName = 'logs.log';
    this.logFilePath = join(
      dirname(this.logFileName),
      'logs/',
      this.logFileName,
    );
    this.maxLogFileSize = parseInt(process.env.MAX_LOG_SIZE_KB) * 1024; // Максимальный размер файла журнала (10 килобайт)
  }

  private async rotateLogFileIfNeeded() {
    try {
      const stats = await stat(this.logFilePath);
      if (stats.size >= this.maxLogFileSize) {
        const existingLogFiles = await readdir(dirname(this.logFilePath));
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
        console.log(this.logFilePath, newLogFileName);
        const newLogFilePath = join(dirname(this.logFilePath), newLogFileName);
        await rename(this.logFilePath, newLogFilePath);
      }
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
    await this.rotateLogFileIfNeeded();
    await this.ensureDirectoryExists(dirname(this.logFilePath));
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${sign}] ${data}\n`;
    appendFile(this.logFilePath, logMessage, { encoding: 'utf8', flag: 'a' });
  }

  async error(message: string, trace: string) {
    this.write('ERR', message);
    super.error(message, trace);
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
      'REQ',
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
  logResponse(statusCode: number) {
    this.write('RES', `Outgoing response - Status Code: ${statusCode}`);
    this.log(`Outgoing response - ${blue('Status Code')} ${statusCode}`, '');
  }
}
