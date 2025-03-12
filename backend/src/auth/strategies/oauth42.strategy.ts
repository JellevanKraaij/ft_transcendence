import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { oauth42Constants } from '../constants';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor() {
    super({
      clientID: oauth42Constants.clientID,
      clientSecret: oauth42Constants.clientSecret,
      callbackURL: oauth42Constants.callbackURL,
      profileFields: {
        id: 'id',
        username: 'login',
        displayName: 'displayname',
        email: 'email',
        image: 'image.link',
      },
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = {
      oauth42Id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.email,
      image: profile.image,
    };

    // check or create user in your database
    // return full user object
    return user;
  }
}
