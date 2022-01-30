import { LoginInCloudUsecase } from '@/domain/auth';
import { LoginInCloud } from '@/domain/auth/login-in-cloud/login-in-cloud';
import {
  makeCognitoListUsersFromCloudRepository,
  makeCognitoLoginInCloudProvider,
} from '@/main/factories/infra/cloud/cognito';
import { makeListUsersFromDatabaseUsecase } from '@/main/factories/usecases/user';

export const makeLoginInCloudUsecase = (): LoginInCloudUsecase => {
  const listUsersFromDatabaseUsecase = makeListUsersFromDatabaseUsecase();
  const loginInCloudProvider = makeCognitoLoginInCloudProvider();
  const listUsersFromCloudUsecase = makeCognitoListUsersFromCloudRepository();

  return new LoginInCloud({
    listUsersFromDatabaseUsecase,
    listUsersFromCloudUsecase,
    loginInCloudProvider,
  });
};
