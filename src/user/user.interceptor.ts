import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => {
            const newItem = { ...item };
            if (newItem.password) {
              delete newItem.password;
            }
            return newItem;
          });
        } else {
          const newData = { ...data };
          if (newData.password) {
            delete newData.password;
          }
          return newData;
        }
      }),
    );
  }
}
