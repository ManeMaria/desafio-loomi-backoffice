import { PrismaGetAuthUserByEmailRepository } from '@/domains/auth/infra/prisma/repositories';
import { CognitoGetAuthUserByTokenInCloudGateway } from '@/domains/auth/infra/cognito/gateways';
import { makeGetAuthUserByTokenValidation } from '@/domains/auth/interface/validation';
import { HttpGetAuthUserByTokenController } from '@/domains/auth/interface/http';

export const makeHttpGetAuthUserByTokenController = (
  authUserRole: 'ADMIN' | 'CLIENT' = 'CLIENT'
): HttpGetAuthUserByTokenController => {
  const getAuthUserByEmailRepository = new PrismaGetAuthUserByEmailRepository();
  const getAuthUserByTokenInCloudGateway =
    new CognitoGetAuthUserByTokenInCloudGateway();
  const validation = makeGetAuthUserByTokenValidation();

  return new HttpGetAuthUserByTokenController(
    getAuthUserByTokenInCloudGateway,
    getAuthUserByEmailRepository,
    validation,
    authUserRole
  );
};
