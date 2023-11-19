import {
  PrismaDeleteUserByIdRepository,
  PrismaGetUserByEmailRepository,
  PrismaSaveUserRepository,
} from '@/domains/user/infra/prisma/repositories';
import {
  CognitoGetUserByEmailInCloudRepository,
  CognitoSaveUserInCloudRepository,
} from '@/domains/user/infra/cognito/repositories';
import { HttpCreateUserController } from '@/domains/user/interface/http';
import { makeCreateUserValidation } from '@/domains/user/interface/validation';

import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';

export const makeHttpCreateUserController = (): HttpCreateUserController => {
  const getUserByEmailRepository = new PrismaGetUserByEmailRepository();
  const getUserByEmailInCloudRepository =
    new CognitoGetUserByEmailInCloudRepository();
  const uuidGenerator = new UUIDGeneratorAdapter();
  const saveUserRepository = new PrismaSaveUserRepository();
  const saveUserInCloudRepository = new CognitoSaveUserInCloudRepository();
  const deleteUserByIdRepository = new PrismaDeleteUserByIdRepository();
  const validation = makeCreateUserValidation();

  return new HttpCreateUserController(
    getUserByEmailRepository,
    getUserByEmailInCloudRepository,
    uuidGenerator,
    saveUserRepository,
    saveUserInCloudRepository,
    deleteUserByIdRepository,
    validation
  );
};
