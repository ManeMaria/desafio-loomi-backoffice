import { GetRefreshTokenUsecase } from '@/domains/auth/usecases';
import { IGetRefreshTokenInCloudGateway } from '@/domains/auth/usecases/gateways';
import { AccessDefaultPresenter } from '@/domains/auth/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetRefreshTokenRequest {
  refreshToken: string;
}

export type GetRefreshTokenResponse = AccessDefaultPresenter;

export class GetRefreshTokenController {
  private usecase: GetRefreshTokenUsecase;

  constructor(
    getRefreshTokenInCloudGateway: IGetRefreshTokenInCloudGateway,
    private readonly validation: Validation
  ) {
    this.usecase = new GetRefreshTokenUsecase(getRefreshTokenInCloudGateway);
  }

  async execute(
    request: GetRefreshTokenRequest
  ): Promise<GetRefreshTokenResponse> {
    console.log({ message: 'Request Received', data: request });

    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated', data: request });

    const { refreshToken } = request;

    const access = await this.usecase.execute({
      refreshToken,
    });

    const accessDefaultPresenter = {
      access_token: access.accessToken,
      refresh_token: access.refreshToken,
    };

    console.log({ message: 'Refresh token getted' });

    return accessDefaultPresenter;
  }
}
