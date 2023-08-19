import {
  Injectable,
  Scope,
  ConsoleLogger,
  LoggerService,
} from '@nestjs/common';

const blue = (text) => `\x1b[34m${text}:\x1b[32m`;
const red = (text) => `\x1b[31m${text}:\x1b[32m`;

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  // error(message: string, trace: string) {
  //   console.log('ERROR WAS LOGED');

  //   super.error(message, trace); // Вызываем метод error из ConsoleLogger с изменениями
  // }

  logRequest(url: string, method: string, queryParameters: any, body: any) {
    this.log(
      `${blue('URL')} ${url}, ${blue('Method')} ${method}, ${blue(
        'Query Parameters',
      )} ${JSON.stringify(queryParameters)}, ${blue('Body')} ${JSON.stringify(
        body,
      )}`,
    );
  }
  logResponse(statusCode: number) {
    this.log(`Outgoing response - ${blue('Status Code')} ${statusCode}`);
  }
}
