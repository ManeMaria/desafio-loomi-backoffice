import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

import { AuthUserDTO } from '@/domains/auth';

export class AuthUserAlreadyMadeFirstLoginException extends DefaultException {
  constructor(authUser: Partial<AuthUserDTO>) {
    super({
      type: ExceptionTypes.USER,
      code: 'AUTH_USER_ALREADY_MADE_FIRST_LOGIN',
      data: authUser,
    });
  }
}
