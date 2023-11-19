import { adaptMiddleware } from '@/shared/infra/express/adapters';
import { makeHttpGetAuthUserByTokenController } from '@/domains/auth/factories/http/http-get-auth-user-by-token-controller-factory';

export const authMiddleware = (role: 'ADMIN' | 'CLIENT' = 'CLIENT') => {
  return adaptMiddleware(makeHttpGetAuthUserByTokenController(role));
};
