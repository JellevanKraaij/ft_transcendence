import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleType } from './role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(RoleType)
  role: RoleType;
}
