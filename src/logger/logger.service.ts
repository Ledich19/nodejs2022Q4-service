import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

const blue = (text) => `\x1b[34m${text}:\x1b[32m`;

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
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
