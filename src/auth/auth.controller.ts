import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';
import { HttpExceptionFilter } from 'src/exceptions/custom-exception.filter';

@UseInterceptors(LoggingInterceptor)
//@UseFilters(HttpExceptionFilter)
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

  @Post('refresh')
  async refreshTokens(@Body() refreshDto: RefreshDto) {
    const tokens = await this.authService.refresh(refreshDto);
    return tokens;
  }
}
