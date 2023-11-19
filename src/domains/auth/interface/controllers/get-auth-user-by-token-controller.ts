import { GetAuthUserByTokenUsecase } from '@/domains/auth/usecases';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import { IGetAuthUserByTokenInCloudGateway } from '@/domains/auth/usecases/gateways';
import {
  AuthUserDefaultPresenter,
  AuthUserTransformers,
} from '@/domains/auth/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetUserByTokenRequest {
  token: string;
}

export type GetUserByTokenResponse = AuthUserDefaultPresenter;

export class GetAuthUserByTokenController {
  private usecase: GetAuthUserByTokenUsecase;

  constructor(
    getAuthUserByTokenInCloudGateway: IGetAuthUserByTokenInCloudGateway,
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new GetAuthUserByTokenUsecase(
      getAuthUserByTokenInCloudGateway,
      getAuthUserByEmailRepository
    );
  }

  async execute(
    request: GetUserByTokenRequest
  ): Promise<GetUserByTokenResponse> {
    console.log({ message: 'Request Received', data: request });

    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const { token } = request;

    const accessTokenWithouBearer = token.replace('Bearer ', '');

    const authUser = await this.usecase.execute({
      token: accessTokenWithouBearer,
    });

    const autUserPresenter =
      AuthUserTransformers.generateDefaultPresenter(authUser);

    console.log({
      message: 'Auth User found by token',
      data: autUserPresenter,
    });

    return autUserPresenter;
  }
}
