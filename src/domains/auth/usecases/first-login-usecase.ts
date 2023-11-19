import { Access, AuthUser } from '@/domains/auth/entities';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserAlreadyMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';

import {
  IGetAuthUserByEmailInCloudGateway,
  IFirstLoginInCloudGateway,
  ILoginInCloudGateway,
} from '@/domains/auth/usecases/gateways';

export interface IFirstLoginUsecase {
  execute(
    params: IFirstLoginUsecase.Params
  ): Promise<IFirstLoginUsecase.Response>;
}

export namespace IFirstLoginUsecase {
  export type Params = {
    email: string;
    newPassword: string;
    temporaryPassword: string;
  };

  export type Response = { access: Access; authUser: AuthUser };
}

export class FirstLoginUsecase implements IFirstLoginUsecase {
  constructor(
    private readonly getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    private readonly getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    private readonly firstLoginInCloudGateway: IFirstLoginInCloudGateway,
    private readonly loginInCloudGateway: ILoginInCloudGateway
  ) {}

  async execute(
    firstLoginParams: IFirstLoginUsecase.Params
  ): Promise<IFirstLoginUsecase.Response> {
    console.log({
      message: 'Request Received',
      data: firstLoginParams,
    });

    const { email, newPassword, temporaryPassword } = firstLoginParams;

    const authUser = await this.getAuthUserByEmailRepository.get(email);

    if (!authUser) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({
      message: 'Auth User found',
      data: authUser,
    });

    const cloudAuthUser = await this.getAuthUserByEmailInCloudGateway.get(
      email
    );

    if (!cloudAuthUser) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({
      message: 'Auth User found in cloud',
      data: cloudAuthUser,
    });

    const { status: cloudAuthUserStatus } = cloudAuthUser;

    if (cloudAuthUserStatus !== 'FORCE_CHANGE_PASSWORD') {
      throw new AuthUserAlreadyMadeFirstLoginException(authUser);
    }

    await this.firstLoginInCloudGateway.login({
      email,
      newPassword,
      temporaryPassword,
    });

    const access = await this.loginInCloudGateway.login({
      email,
      password: newPassword,
    });

    console.log({
      message: 'Auth User made first login',
      data: authUser,
    });

    return { access, authUser };
  }
}
