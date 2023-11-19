import { LoginUsecase } from '@/domains/auth/usecases';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  ILoginInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';
import {
  AccessDefaultPresenter,
  AuthUserDefaultPresenter,
  AuthUserTransformers,
} from '@/domains/auth/interface/presenters';

import { Validation } from '@/shared/interface/validation/protocols';
import { ValidationException } from '@/shared/helpers';

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = {
  access: AccessDefaultPresenter;
  authUser: AuthUserDefaultPresenter;
};

export class LoginController {
  private usecase: LoginUsecase;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    loginInCloudGateway: ILoginInCloudGateway,
    private readonly validation: Validation
  ) {
    this.usecase = new LoginUsecase(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      loginInCloudGateway
    );
  }

  async execute(request: LoginRequest): Promise<LoginResponse> {
    console.log({ message: 'Request Received', data: request });

    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params Validated' });

    const { email, password } = request;

    const { access, authUser } = await this.usecase.execute({
      email,
      password,
    });

    const accessDefaultPresenter = {
      access_token: access.accessToken,
      refresh_token: access.refreshToken,
    };

    const authUserDefaultPresenter =
      AuthUserTransformers.generateDefaultPresenter(authUser);

    console.log({
      message: 'Auth User logged',
      data: authUserDefaultPresenter,
    });

    return {
      access: accessDefaultPresenter,
      authUser: authUserDefaultPresenter,
    };
  }
}
