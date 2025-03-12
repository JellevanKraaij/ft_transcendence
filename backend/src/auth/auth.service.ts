import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { OAuth42User } from './interfaces/oauth42-user.interface';
import * as bcrypt from 'bcryptjs';
import { bcryptConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateLocalUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
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

  async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign({ sub: user.id, ...user }),
    };
  }

  async findOrCreateUserFromOAuth42(
    oauth42User: OAuth42User,
  ): Promise<Omit<User, 'password'>> {
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

  async register(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    Logger.log(`Registering user: ${username}`);
    const hashedPassword = await bcrypt.hash(pass, bcryptConstants.saltRounds);
    Logger.log(`Hashed password: ${hashedPassword}`);
    const user = await this.usersService.createUser({
      username,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }
}
