import { PrismaGetAuthUserByEmailRepository } from '@/domains/auth/infra/prisma/repositories';
import {
  CognitoGetAuthUserByEmailInCloudGateway,
  CognitoConfirmForgotPasswordInCloudGateway,
} from '@/domains/auth/infra/cognito/gateways';
import { makeConfirmForgotPasswordValidation } from '@/domains/auth/interface/validation';
import { HttpConfirmForgotPasswordController } from '@/domains/auth/interface/http';

export const makeHttpConfirmForgotPasswordController =
  (): HttpConfirmForgotPasswordController => {
    const getAuthUserByEmailRepository =
      new PrismaGetAuthUserByEmailRepository();
    const getAuthUserByEmailInCloudGateway =
      new CognitoGetAuthUserByEmailInCloudGateway();
    const confirmForgotPasswordInCloudGateway =
      new CognitoConfirmForgotPasswordInCloudGateway();
    const validation = makeConfirmForgotPasswordValidation();

    return new HttpConfirmForgotPasswordController(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      confirmForgotPasswordInCloudGateway,
      validation
    );
  };
