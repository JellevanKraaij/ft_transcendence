import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //   @Put()
  //   async updateUser(@Req() req: Request, @Body() data: User) {
  //     return this.userService.updateUser();
  //   }
}
