import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup(): string {
    return 'signup';
  }
  login(): string {
    return 'login';
  }
}
