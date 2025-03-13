import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { oauth42Constants } from '../constants';
import { OAuth42User } from '../types/oauth42-user.type';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor(private authService: AuthService) {
    super({
      clientID: oauth42Constants.clientID,
      clientSecret: oauth42Constants.clientSecret,
      callbackURL: oauth42Constants.callbackURL,
      profileFields: {
        id: 'id',
        username: 'login',
        image: 'image.link',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<Partial<User>> {
    const user: OAuth42User = {
      id: profile.id,
      username: profile.username,
      image: profile.image,
    };
    return this.authService.findOrCreateUserFromOAuth42(user);
  }
}
