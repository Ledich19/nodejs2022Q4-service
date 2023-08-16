import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authDto: AuthDto) {
    return await this.authService.signup(authDto);
  }

  @Post('login')
  signIn(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }
}
