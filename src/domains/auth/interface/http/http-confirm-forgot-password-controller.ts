import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  IGetAuthUserByEmailInCloudGateway,
  IConfirmForgotPasswordInCloudGateway,
} from '@/domains/auth/usecases/gateways';
import { ConfirmForgotPasswordController } from '@/domains/auth/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';

export interface HttpConfirmForgotPasswordRequest {
  email: string;
  verification_code: string;
  new_password: string;
}

export class HttpConfirmForgotPasswordController implements HttpController {
  private controller: ConfirmForgotPasswordController;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    confirmForgotPasswordInCloudGateway: IConfirmForgotPasswordInCloudGateway,
    validation: Validation
  ) {
    this.controller = new ConfirmForgotPasswordController(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      confirmForgotPasswordInCloudGateway,
      validation
    );
  }

  async handle(
    httpRequest: HttpConfirmForgotPasswordRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      email,
      verification_code: verificationCode,
      new_password: newPassword,
    } = httpRequest;

    try {
      await this.controller.execute({
        email,
        verificationCode,
        newPassword,
      });

      console.log({
        message: 'Auth User confirmed forgot password',
        data: httpRequest,
      });

      return ok();
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof AuthUserNotFoundException ||
        error instanceof AuthUserNotMadeFirstLoginException ||
        error instanceof CognitoException
      ) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
