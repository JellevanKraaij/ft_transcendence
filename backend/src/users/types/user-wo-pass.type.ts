import { User } from '@prisma/client';

export type UserWoPass = Omit<User, 'password'>;
