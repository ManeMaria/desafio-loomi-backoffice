import { User } from '@/domains/user/entities';
import { UserDefaultPresenter } from '@/domains/user/interface/presenters';

export class UserTransformers {
  static generateDefaultTransformer(user: User): UserDefaultPresenter {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
