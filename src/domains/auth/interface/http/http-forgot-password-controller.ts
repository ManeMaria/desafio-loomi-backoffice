import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';
import { ValidationException } from '@/shared/helpers';

import {
  AuthUserNotFoundException,
  IGetAuthUserByEmailInCloudGateway,
  IGetAuthUserByEmailRepository,
  ForgotPasswordController,
  IForgotPasswordInCloudGateway,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth';

export interface HttpForgotPasswordRequest {
  email: string;
}

export class HttpForgotPasswordController implements HttpController {
  private controller: ForgotPasswordController;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    forgotPasswordInCloudGateway: IForgotPasswordInCloudGateway,
    validation: Validation
  ) {
    this.controller = new ForgotPasswordController(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      forgotPasswordInCloudGateway,
      validation
    );
  }

  async handle(httpRequest: HttpForgotPasswordRequest): Promise<HttpResponse> {
    const { email } = httpRequest;

    try {
      await this.controller.execute({
        email,
      });

      return ok();
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof AuthUserNotFoundException ||
        error instanceof AuthUserNotMadeFirstLoginException
      ) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
