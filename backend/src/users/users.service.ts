import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, Prisma } from '@prisma/client';
import { UserWoPass } from './types/user-wo-pass.type';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async user(
    usersWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserWoPass | null> {
    return this.databaseService.user.findUnique({
      where: usersWhereUniqueInput,
    });
  }

  async userWithPassword(
    usersWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.databaseService.user.findFirst({
      where: usersWhereUniqueInput,
      omit: { password: false },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserWoPass | null> {
    try {
      return await this.databaseService.user.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<UserWoPass | null> {
    try {
      return this.databaseService.user.update({
        where,
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
}
