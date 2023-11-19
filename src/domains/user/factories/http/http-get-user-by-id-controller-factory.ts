import { PrismaGetUserByIdRepository } from '@/domains/user/infra/prisma/repositories';
import { CognitoGetUserByEmailInCloudRepository } from '@/domains/user/infra/cognito/repositories';
import { HttpGetUserByIdController } from '@/domains/user/interface/http';
import { makeGetUserByIdValidation } from '@/domains/user/interface/validation';

export const makeHttpGetUserByIdController = (): HttpGetUserByIdController => {
  const getUserByIdRepository = new PrismaGetUserByIdRepository();
  const getUserByEmailInCloudRepository =
    new CognitoGetUserByEmailInCloudRepository();
  const validation = makeGetUserByIdValidation();

  return new HttpGetUserByIdController(
    getUserByIdRepository,
    getUserByEmailInCloudRepository,
    validation
  );
};
