import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserAlreadyMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  ILoginInCloudGateway,
  IFirstLoginInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';
import { FirstLoginController } from '@/domains/auth/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';

export interface HttpFirstLoginRequest {
  email: string;
  new_password: string;
  temporary_password: string;
}

export class HttpFirstLoginController implements HttpController {
  private controller: FirstLoginController;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    firstLoginInCloudGateway: IFirstLoginInCloudGateway,
    loginInCloudGateway: ILoginInCloudGateway,
    validation: Validation
  ) {
    this.controller = new FirstLoginController(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      firstLoginInCloudGateway,
      loginInCloudGateway,
      validation
    );
  }

  async handle(httpRequest: HttpFirstLoginRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      email,
      new_password: newPassword,
      temporary_password: temporaryPassword,
    } = httpRequest;

    try {
      const {
        access: { access_token: accessToken, refresh_token: refreshToken },
        authUser,
      } = await this.controller.execute({
        email,
        newPassword,
        temporaryPassword,
      });

      console.log({
        message: 'Auth User made first login',
        data: authUser,
      });

      return ok({ accessToken, refreshToken, authUser });
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof AuthUserNotFoundException ||
        error instanceof AuthUserAlreadyMadeFirstLoginException ||
        error instanceof CognitoException
      ) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
