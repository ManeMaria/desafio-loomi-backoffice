import { PrismaGetAuthUserByEmailRepository } from '@/domains/auth/infra/prisma/repositories';
import {
  CognitoLoginInCloudGateway,
  CognitoFirstLoginInCloudGateway,
  CognitoGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/infra/cognito/gateways';
import { makeFirstLoginValidation } from '@/domains/auth/interface/validation';
import { HttpFirstLoginController } from '@/domains/auth/interface/http';

export const makeHttpFirstLoginController = (): HttpFirstLoginController => {
  const getAuthUserByEmailRepository = new PrismaGetAuthUserByEmailRepository();
  const getAuthUserByEmailInCloudGateway =
    new CognitoGetAuthUserByEmailInCloudGateway();
  const firstLoginInCloudGateway = new CognitoFirstLoginInCloudGateway();
  const loginInCloudGateway = new CognitoLoginInCloudGateway();
  const validation = makeFirstLoginValidation();

  return new HttpFirstLoginController(
    getAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway,
    firstLoginInCloudGateway,
    loginInCloudGateway,
    validation
  );
};
