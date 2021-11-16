import {
  UpdateUserInDatabaseUsecase,
  UpdateUserInDatabase,
} from '@/domain/usecases/user/update-user-in-database';
import { makePrismaUpdateUserInDatabaseRepository } from '@/main/factories/infra/database/orm/prisma/repositories/user';
import { makeListUsersFromDatabaseUsecase } from '@/main/factories/usecases/user';

export const makeUpdateUserInDatabaseUsecase =
  (): UpdateUserInDatabaseUsecase => {
    const listUsersFromDatabaseUsecase = makeListUsersFromDatabaseUsecase();

    const updateUserInDatabaseRepository =
      makePrismaUpdateUserInDatabaseRepository();

    return new UpdateUserInDatabase({
      listUsersFromDatabaseUsecase,
      updateUserInDatabaseRepository,
    });
  };
