import { ForgotPasswordUsecase } from '@/domains/auth/usecases';
import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';
import {
  IGetAuthUserByEmailInCloudGateway,
  IForgotPasswordInCloudGateway,
} from '@/domains/auth/usecases/gateways';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface ForgotPasswordRequest {
  email: string;
}

export type ForgotPasswordResponse = void;

export class ForgotPasswordController {
  private usecase: ForgotPasswordUsecase;

  constructor(
    getAuthUserByEmailRepository: IGetAuthUserByEmailRepository,
    getAuthUserByEmailInCloudGateway: IGetAuthUserByEmailInCloudGateway,
    forgotPasswordInCloudGateway: IForgotPasswordInCloudGateway,
    private readonly validation: Validation
  ) {
    this.usecase = new ForgotPasswordUsecase(
      getAuthUserByEmailRepository,
      getAuthUserByEmailInCloudGateway,
      forgotPasswordInCloudGateway
    );
  }

  async execute(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    console.log({ message: 'Request Received', data: request });
    const hasError = this.validation.validate(request);

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const { email } = request;

    await this.usecase.execute({
      email,
    });
  }
}
