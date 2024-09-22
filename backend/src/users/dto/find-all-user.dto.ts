import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from './role.enum';

export class FindAllUserDTO {
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;
}
