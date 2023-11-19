import { ConfirmForgotPasswordUsecase } from '@/domains/auth/usecases';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  IGetAuthUserByEmailInCloudGateway,
  IConfirmForgotPasswordInCloudGateway,
} from '@/domains/auth/usecases/gateways';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface ConfirmForgotPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export type ConfirmForgotPasswordResponse = void;

export class ConfirmForgotPasswordController {
  private usecase: ConfirmForgotPasswordUsecase;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    confirmForgotPasswordInCloudGateway: IConfirmForgotPasswordInCloudGateway,
    private readonly validation: Validation
  ) {
    this.usecase = new ConfirmForgotPasswordUsecase(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      confirmForgotPasswordInCloudGateway
    );
  }

  async execute(
    request: ConfirmForgotPasswordRequest
  ): Promise<ConfirmForgotPasswordResponse> {
    console.log({ message: 'Request Received', data: request });
    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params Validated' });

    const { email, verificationCode, newPassword } = request;

    await this.usecase.execute({
      email,
      verificationCode,
      newPassword,
    });

    console.log({
      message: 'Auth User confirm forgot password',
      data: request,
    });
  }
}
