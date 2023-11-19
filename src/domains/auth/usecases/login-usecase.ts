import { Access, AuthUser } from '@/domains/auth/entities';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNeedSetPasswordException,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  IGetAuthUserByEmailInCloudGateway,
  ILoginInCloudGateway,
} from '@/domains/auth/usecases/gateways';

export interface ILoginUsecase {
  execute(params: ILoginUsecase.Params): Promise<ILoginUsecase.Response>;
}

export namespace ILoginUsecase {
  export type Params = {
    email: string;
    password: string;
  };

  export type Response = { access: Access; authUser: AuthUser };
}

export class LoginUsecase implements ILoginUsecase {
  constructor(
    private readonly getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    private readonly getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    private readonly loginInCloudGateway: ILoginInCloudGateway
  ) {}

  async execute(
    loginParams: ILoginUsecase.Params
  ): Promise<ILoginUsecase.Response> {
    console.log({ message: 'Request Received', data: loginParams });

    const { email, password } = loginParams;

    const authUserFound = await this.getAuthUserByEmailRepository.get(email);

    if (!authUserFound) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({ message: 'Auth User found', data: authUserFound });

    const cloudAuthUserInCloud =
      await this.getAuthUserByEmailInCloudGateway.get(email);

    if (!cloudAuthUserInCloud) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({
      message: 'Auth User found in cloud',
      data: cloudAuthUserInCloud,
    });

    const { status: cloudAuthUserStatus } = cloudAuthUserInCloud;

    if (cloudAuthUserStatus === 'FORCE_CHANGE_PASSWORD') {
      throw new AuthUserNotMadeFirstLoginException({ email });
    }

    if (cloudAuthUserStatus === 'NEW_PASSWORD_REQUIRED') {
      throw new AuthUserNeedSetPasswordException({ email });
    }

    const access = await this.loginInCloudGateway.login({
      email,
      password,
    });

    console.log({
      message: 'Auth User logged',
      data: authUserFound,
    });

    return { access, authUser: authUserFound };
  }
}
