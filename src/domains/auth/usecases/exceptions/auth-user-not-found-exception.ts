import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

import { AuthUser } from '@/domains/auth';

export class AuthUserNotFoundException extends DefaultException {
  constructor(authUser: Partial<AuthUser>) {
    super({
      type: ExceptionTypes.USER,
      code: 'AUTH_USER_NOT_FOUND',
      data: authUser,
    });
  }
}
