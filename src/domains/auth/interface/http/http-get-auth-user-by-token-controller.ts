import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNotFoundByTokenException,
} from '@/domains/auth/usecases/exceptions';
import { IGetAuthUserByTokenInCloudGateway } from '@/domains/auth/usecases/gateways';
import { GetAuthUserByTokenController } from '@/domains/auth/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import {
  ok,
  forbidden,
  badRequest,
  serverError,
  unauthorized,
} from '@/shared/interface/http/helpers';

import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpGetAuthUserByTokenRequest {
  access_token: string;
}

export class HttpGetAuthUserByTokenController implements HttpController {
  private controller: GetAuthUserByTokenController;

  constructor(
    getAuthUserByTokenInCloudGateway: IGetAuthUserByTokenInCloudGateway,
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    validation: Validation,
    private readonly authUserRole: ('ADMIN' | 'USER')[]
  ) {
    this.controller = new GetAuthUserByTokenController(
      getAuthUserByTokenInCloudGateway,
      getAuthUserByEmailRepository,
      validation
    );
  }

  async handle(
    httpRequest: HttpGetAuthUserByTokenRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { access_token: accessToken } = httpRequest;

    try {
      const authUser = await this.controller.execute({
        token: accessToken,
      });

      console.log({
        message: 'Auth User found by token',
        data: authUser,
      });

      if (!this.authUserRole.includes(authUser.type as 'ADMIN' | 'USER')) {
        return forbidden();
      }

      console.log({
        message: 'Auth User authorized',
        data: authUser,
      });

      return ok(authUser);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (
        error instanceof AuthUserNotFoundException ||
        error instanceof AuthUserNotFoundByTokenException ||
        error instanceof CognitoException
      ) {
        return unauthorized(error);
      }

      return serverError(error as Error);
    }
  }
}
