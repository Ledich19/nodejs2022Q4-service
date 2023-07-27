import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body('email') dto: AuthDto) {
    return this.authService.signup();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
