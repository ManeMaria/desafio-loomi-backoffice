import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  AuthUserNotFoundException,
  AuthUserNotMadeFirstLoginException,
} from '@/domains/auth/usecases/exceptions';
import {
  IConfirmForgotPasswordInCloudGateway,
  IGetAuthUserByEmailInCloudGateway,
} from '@/domains/auth/usecases/gateways';

export interface IConfirmForgotPasswordUsecase {
  execute(
    params: IConfirmForgotPasswordUsecase.Params
  ): Promise<IConfirmForgotPasswordUsecase.Response>;
}

export namespace IConfirmForgotPasswordUsecase {
  export type Params = {
    email: string;
    verificationCode: string;
    newPassword: string;
  };
  export type Response = void;
}

export class ConfirmForgotPasswordUsecase
  implements IConfirmForgotPasswordUsecase
{
  constructor(
    private readonly getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    private readonly getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    private readonly confirmForgotPasswordInCloudGateway: IConfirmForgotPasswordInCloudGateway
  ) {}

  async execute(
    confirmForgotParams: IConfirmForgotPasswordUsecase.Params
  ): Promise<IConfirmForgotPasswordUsecase.Response> {
    console.log({
      message: 'Request Received',
      data: confirmForgotParams,
    });

    const { email, verificationCode, newPassword } = confirmForgotParams;

    const authUserFound = await this.getAuthUserByEmailRepository.get(email);

    if (!authUserFound) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({
      message: 'Auth User found',
      data: authUserFound,
    });

    const cloudAuthUserFound = await this.getAuthUserByEmailInCloudGateway.get(
      email
    );

    if (!cloudAuthUserFound) {
      throw new AuthUserNotFoundException({ email });
    }

    console.log({
      message: 'Auth User found in cloud',
      data: cloudAuthUserFound,
    });

    const { status: cloudAuthUserStatus } = cloudAuthUserFound;

    if (cloudAuthUserStatus === 'FORCE_CHANGE_PASSWORD') {
      throw new AuthUserNotMadeFirstLoginException({ email });
    }

    await this.confirmForgotPasswordInCloudGateway.confirm({
      email,
      verificationCode,
      newPassword,
    });

    console.log({
      message: 'Auth User confirm forgot password',
      data: confirmForgotParams,
    });
  }
}
