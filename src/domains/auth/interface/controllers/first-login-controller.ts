import { FirstLoginUsecase } from '@/domains/auth/usecases';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  ILoginInCloudGateway,
  IFirstLoginInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';
import {
  AccessDefaultPresenter,
  AuthUserDefaultPresenter,
  AuthUserTransformers,
} from '@/domains/auth/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface FirstLoginRequest {
  email: string;
  newPassword: string;
  temporaryPassword: string;
}

export type FirstLoginResponse = {
  access: AccessDefaultPresenter;
  authUser: AuthUserDefaultPresenter;
};

export class FirstLoginController {
  private usecase: FirstLoginUsecase;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    firstLoginInCloudGateway: IFirstLoginInCloudGateway,
    loginInCloudGateway: ILoginInCloudGateway,
    private readonly validation: Validation
  ) {
    this.usecase = new FirstLoginUsecase(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      firstLoginInCloudGateway,
      loginInCloudGateway
    );
  }

  async execute(request: FirstLoginRequest): Promise<FirstLoginResponse> {
    console.log({ message: 'Request Received', data: request });

    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const { email, newPassword, temporaryPassword } = request;

    const { access, authUser } = await this.usecase.execute({
      email,
      newPassword,
      temporaryPassword,
    });

    const accessDefaultPresenter = {
      access_token: access.accessToken,
      refresh_token: access.refreshToken,
    };

    const authUserDefaultPresenter =
      AuthUserTransformers.generateDefaultPresenter(authUser);

    console.log({
      message: 'Auth User made first login',
      data: authUser,
    });

    return {
      access: accessDefaultPresenter,
      authUser: authUserDefaultPresenter,
    };
  }
}
