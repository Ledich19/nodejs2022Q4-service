import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  logRequest(url: string, method: string, queryParameters: any, body: any) {
    this.log(
      `URL: ${url}, Method: ${method}, Query Parameters: ${JSON.stringify(
        queryParameters,
      )}, Body: ${JSON.stringify(body)}`,
    );
  }

  logResponse(statusCode: number) {
    this.log(`Outgoing response - Status Code: ${statusCode}`);
  }
}
