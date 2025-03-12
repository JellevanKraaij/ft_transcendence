import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.AuthService.signIn(signInDto.username, signInDto.password);
  }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
