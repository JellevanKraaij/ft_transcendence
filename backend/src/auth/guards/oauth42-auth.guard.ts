import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth42AuthGuard extends AuthGuard('oauth42') {}
