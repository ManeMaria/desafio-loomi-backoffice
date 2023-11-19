import { AuthUser } from '@/domains/auth/entities';
import { AuthUserDefaultPresenter } from '@/domains/auth/interface/presenters';

export class AuthUserTransformers {
  static generateDefaultPresenter(
    authUser: AuthUser
  ): AuthUserDefaultPresenter {
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      type: authUser.type,
    };
  }
}
