import { GetUserByIdUsecase } from '@/domains/user/usecases';
import {
  IGetUserByIdRepository,
  IGetUserByEmailInCloudRepository,
} from '@/domains/user/usecases/repos';
import {
  UserDefaultPresenter,
  UserTransformers,
} from '@/domains/user/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetUserByIdRequest {
  id: string;
}

export type GetUserByIdResponse = UserDefaultPresenter | null;

export class GetUserByIdController {
  private usecase: GetUserByIdUsecase;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new GetUserByIdUsecase(
      getUserByIdRepository,
      getUserByEmailInCloudRepository
    );
  }

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    console.log({ message: 'Request Received', data: request });

    const { id } = request;

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params Validated' });

    const user = await this.usecase.execute(id);

    console.log({ message: 'User found', data: user });

    if (!user) {
      return null;
    }

    const userPresenter = UserTransformers.generateDefaultTransformer(user);

    return userPresenter;
  }
}
