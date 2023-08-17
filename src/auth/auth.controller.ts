import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authDto: AuthDto) {
    const user = await this.authService.signup(authDto);
    return user;
  }

  @Post('login')
  async signIn(@Body() loginDto: AuthDto) {
    const login = await this.authService.login(loginDto);
    return login;
  }
}
