import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MyLogger } from './logger.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: MyLogger, private moduleRef: ModuleRef) {}

  private getModuleName(context: ExecutionContext) {
    const target = context.getClass();
    const className = target.name;
    this.logger.setContext(className);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.getModuleName(context);
    const { method, url, query, body } = request;

    this.logger.logRequest(url, method, query, body);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logger.logResponse(statusCode);
      }),
    );
  }
}
