import {
  PrismaDeleteUserByIdRepository,
  PrismaGetUserByIdRepository,
} from '@/domains/user/infra/prisma/repositories';
import {
  CognitoGetUserByEmailInCloudRepository,
  CognitoDeleteUserByEmailInCloudRepository,
} from '@/domains/user/infra/cognito/repositories';
import { HttpDeleteUserByIdController } from '@/domains/user/interface/http';
import { makeDeleteUserByIdValidation } from '@/domains/user/interface/validation';

export const makeHttpDeleteUserByIdController =
  (): HttpDeleteUserByIdController => {
    const getUserByIdRepository = new PrismaGetUserByIdRepository();
    const getUserByEmailInCloudRepository =
      new CognitoGetUserByEmailInCloudRepository();
    const deleteUserByEmailInCloudRepository =
      new CognitoDeleteUserByEmailInCloudRepository();
    const deleteUserByIdRepository = new PrismaDeleteUserByIdRepository();
    const validation = makeDeleteUserByIdValidation();

    return new HttpDeleteUserByIdController(
      getUserByIdRepository,
      getUserByEmailInCloudRepository,
      deleteUserByEmailInCloudRepository,
      deleteUserByIdRepository,
      validation
    );
  };
