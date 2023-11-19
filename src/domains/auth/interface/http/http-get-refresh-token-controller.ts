import { IGetRefreshTokenInCloudGateway } from '@/domains/auth/usecases/gateways';
import { GetRefreshTokenController } from '@/domains/auth/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { CognitoException } from '@/shared/infra/cognito';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';

export interface HttpGetRefreshTokenRequest {
  refresh_token: string;
}

export class HttpGetRefreshTokenController implements HttpController {
  private controller: GetRefreshTokenController;

  constructor(
    getRefreshTokenInCloudGateway: IGetRefreshTokenInCloudGateway,
    validation: Validation
  ) {
    this.controller = new GetRefreshTokenController(
      getRefreshTokenInCloudGateway,
      validation
    );
  }

  async handle(httpRequest: HttpGetRefreshTokenRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { refresh_token: refreshToken } = httpRequest;

    try {
      const { access_token: accessToken, refresh_token: newRefreshToken } =
        await this.controller.execute({
          refreshToken,
        });

      console.log({ message: 'Token getted by refresh' });

      return ok({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof CognitoException
      ) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
