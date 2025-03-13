import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth42User } from './types/oauth42-user.type';
import { UserWoPass } from '../user/types/user-wo-pass.type';
import * as bcrypt from 'bcryptjs';
import { bcryptConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateLocalUser(
    username: string,
    password: string,
  ): Promise<UserWoPass | null> {
    if (!username || !password) {
      return null;
    }
    const user = await this.usersService.userWithPassword({
      username: username,
    });
    if (!user || !user.password) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWoPass): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign({ sub: user.id, ...user }),
    };
  }

  async refresh(user: UserWoPass): Promise<{ access_token: string }> {
    const new_user = await this.usersService.user({ id: user.id });
    return this.login(new_user);
  }

  async findOrCreateUserFromOAuth42(
    oauth42User: OAuth42User,
  ): Promise<UserWoPass> {
    const user = await this.usersService.user({ oauth42Id: oauth42User.id });
    if (!user) {
      const user = await this.usersService.createUser({
        oauth42Id: oauth42User.id,
        image: oauth42User.image,
      });
      try {
        return await this.usersService.updateUser(
          { id: user.id },
          { username: oauth42User.username },
        );
      } catch (error) {
        if (error! instanceof ConflictException) {
          throw error;
        }
      }
      return user;
    }

    return user;
  }

  async register(username: string, pass: string): Promise<UserWoPass> {
    const hashedPassword = await bcrypt.hash(pass, bcryptConstants.saltRounds);
    const user = await this.usersService.createUser({
      username,
      password: hashedPassword,
    });
    return user;
  }
}
