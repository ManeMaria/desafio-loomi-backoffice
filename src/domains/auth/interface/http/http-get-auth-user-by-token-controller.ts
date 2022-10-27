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
import { ILoggerLocal } from '@/shared/protocols';
import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpGetAuthUserByTokenRequest {
  access_token: string;
}

export class HttpGetAuthUserByTokenController implements HttpController {
  private controller: GetAuthUserByTokenController;
  private logger: ILoggerLocal;

  constructor(
    getAuthUserByTokenInCloudGateway: IGetAuthUserByTokenInCloudGateway,
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    validation: Validation,
    private readonly authUserRole: 'ADMIN' | 'USER',
    logger: ILoggerLocal
  ) {
    this.controller = new GetAuthUserByTokenController(
      getAuthUserByTokenInCloudGateway,
      getAuthUserByEmailRepository,
      validation,
      logger
    );

    this.logger = logger.child({ httpController: 'get-auth-user-by-token' });
  }

  async handle(
    httpRequest: HttpGetAuthUserByTokenRequest
  ): Promise<HttpResponse> {
    this.logger.logDebug({ message: 'Request Received', data: httpRequest });

    const { access_token: accessToken } = httpRequest;

    try {
      const authUser = await this.controller.execute({
        token: accessToken,
      });

      this.logger.logDebug({
        message: 'Auth User found by token',
        data: authUser,
      });

      if (this.authUserRole === 'ADMIN' && !authUser.is_admin) {
        return forbidden();
      }

      this.logger.logDebug({
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
