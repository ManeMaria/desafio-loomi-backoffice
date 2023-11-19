import {
  PrismaGetUsersByFilterRepository,
  PrismaCountUsersByFilterRepository,
} from '@/domains/user/infra/prisma/repositories';
import { HttpGetUsersByFilterController } from '@/domains/user/interface/http';
import { makeGetUsersByFilterValidation } from '@/domains/user/interface/validation';

export const makeHttpGetUsersByFilterController =
  (): HttpGetUsersByFilterController => {
    const getUsersByFilterRepository = new PrismaGetUsersByFilterRepository();
    const countUsersByFilterRepository =
      new PrismaCountUsersByFilterRepository();
    const validation = makeGetUsersByFilterValidation();

    return new HttpGetUsersByFilterController(
      getUsersByFilterRepository,
      countUsersByFilterRepository,
      validation
    );
  };
