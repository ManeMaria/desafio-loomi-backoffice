import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNeedSetPasswordException,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  ILoginInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';
import { LoginController } from '@/domains/auth/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/shared/interface/http/helpers';

import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpLoginRequest {
  email: string;
  password: string;
}

export class HttpLoginController implements HttpController {
  private controller: LoginController;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    loginInCloudGateway: ILoginInCloudGateway,
    validation: Validation
  ) {
    this.controller = new LoginController(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      loginInCloudGateway,
      validation
    );
  }

  async handle(httpRequest: HttpLoginRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { email, password } = httpRequest;

    try {
      const {
        access: { access_token: accessToken, refresh_token: refreshToken },
        authUser,
      } = await this.controller.execute({
        email,
        password,
      });

      console.log({ message: 'Auth User Logged', data: authUser });

      return ok({ accessToken, refreshToken, authUser });
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof AuthUserNotFoundException ||
        error instanceof AuthUserNotMadeFirstLoginException ||
        error instanceof AuthUserNeedSetPasswordException
      ) {
        return badRequest(error);
      }

      if (error instanceof CognitoException) {
        return unauthorized(error);
      }

      return serverError(error as Error);
    }
  }
}
