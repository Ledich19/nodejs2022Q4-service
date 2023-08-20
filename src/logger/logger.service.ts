import {
  Injectable,
  Scope,
  ConsoleLogger,
  LoggerService,
} from '@nestjs/common';

import { appendFile, mkdir, access, stat, rename, readdir } from 'fs/promises';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

//const filePath = new URL('./files/fileToWrite.txt', import.meta.url);

const blue = (text) => `\x1b[34m${text}:\x1b[32m`;
const red = (text) => `\x1b[31m${text}:\x1b[32m`;

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  private logFilePath: string;
  private logDir: string;
  private maxLogFileSize: number;

  constructor() {
    super();
    this.logFilePath = 'logs/logs.log'; // Путь к файлу журнала
    this.logDir = dirname(this.logFilePath);
    this.maxLogFileSize = parseInt(process.env.MAX_LOG_SIZE_KB) * 1024; // Максимальный размер файла журнала (10 килобайт)
  }

  private async rotateLogFileIfNeeded() {
    try {
      const stats = await stat(this.logFilePath);
      if (stats.size >= this.maxLogFileSize) {
        const existingLogFiles = await readdir(this.logDir);
        const logFiles = existingLogFiles.filter(
          (file) => file.startsWith('logs_') && file.endsWith('.log'),
        );
        const max = Math.max(
          ...logFiles.map((el) => parseInt(el.substring(5, 7), 10)),
        );
        const newLogFileName = `log_${max + 1}.log`;
        await rename(this.logFilePath, newLogFileName);
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
    this.rotateLogFileIfNeeded();
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
