import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDTO } from './dto/find-all-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@mail.test',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@mail.test',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Charlie',
      email: 'charlie@mail.test',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Diana',
      email: 'diana@mail.test',
      role: 'ENGINEER',
    },
  ];

  findAll(findAllUserDto: FindAllUserDTO) {
    if (findAllUserDto.role) {
      const usersByRole = this.users.filter(
        (user) => user.role === findAllUserDto.role,
      );
      if (usersByRole.length === 0)
        throw new NotFoundException('role not found');
      return usersByRole;
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          ...updateUserDto,
        };
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
