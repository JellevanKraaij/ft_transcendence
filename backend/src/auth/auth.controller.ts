import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipDefaultAuth } from './decorators/skip-default-auth.decorator';
import { OAuth42AuthGuard } from './guards/oauth42-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipDefaultAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('oauth42')
  @SkipDefaultAuth()
  @UseGuards(OAuth42AuthGuard)
  async oauth42Login() {
    // OAuth42 strategy (guard) will handle the login
  }

  @Get('oauth42/callback')
  @SkipDefaultAuth()
  @UseGuards(OAuth42AuthGuard)
  async oauth42LoginCallback(@Request() req) {
    return req.user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
