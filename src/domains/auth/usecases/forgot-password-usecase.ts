import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  IForgotPasswordInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';

export interface IForgotPasswordUsecase {
  execute(
    params: IForgotPasswordUsecase.Params
  ): Promise<IForgotPasswordUsecase.Response>;
}

export namespace IForgotPasswordUsecase {
  export type Params = { email: string };
  export type Response = void;
}

export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
  constructor(
    private readonly getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    private readonly getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    private readonly forgotPasswordInCloudGateway: IForgotPasswordInCloudGateway
  ) {}

  async execute(
    forgotParams: IForgotPasswordUsecase.Params
  ): Promise<IForgotPasswordUsecase.Response> {
    console.log({ message: 'Request Received', data: forgotParams });

    const { email } = forgotParams;

    const authUserFound = await this.getAuthUserByEmailRepository.get(email);

    if (!authUserFound) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({ message: 'Auth user found', data: authUserFound });

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

    if (cloudAuthUserStatus === 'FORCE_CHANGE_PASSWORD') {
      throw new AuthUserNotMadeFirstLoginException({ email });
    }

    await this.forgotPasswordInCloudGateway.forgot({ email });

    console.log({
      message: 'Auth User forgot password',
      data: email,
    });
  }
}
