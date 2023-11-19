import { CognitoGetRefreshTokenInCloudGateway } from '@/domains/auth/infra/cognito/gateways';
import { makeGetRefreshTokenValidation } from '@/domains/auth/interface/validation';
import { HttpGetRefreshTokenController } from '@/domains/auth/interface/http';

export const makeHttpGetRefreshTokenController =
  (): HttpGetRefreshTokenController => {
    const getRefreshTokenInCloudGateway =
      new CognitoGetRefreshTokenInCloudGateway();
    const validation = makeGetRefreshTokenValidation();

    return new HttpGetRefreshTokenController(
      getRefreshTokenInCloudGateway,
      validation
    );
  };
