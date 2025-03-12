import { SetMetadata } from '@nestjs/common';

export const SKIP_DEFAULT_AUTH_KEY = 'skipDefaultAuth';
export const SkipDefaultAuth = () => SetMetadata(SKIP_DEFAULT_AUTH_KEY, true);
