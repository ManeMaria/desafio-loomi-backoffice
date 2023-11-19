import { UpdateUserByIdUsecase } from '@/domains/user/usecases';
import {
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from '@/domains/user/usecases/repos';
import {
  UserDefaultPresenter,
  UserTransformers,
} from '@/domains/user/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface UpdateUserByIdRequest {
  id: string;
  paramsToUpdate: {
    name?: string;
    email?: string;
    type?: string;
    enabled?: boolean;
  };
}

export type UpdateUserByIdResponse = UserDefaultPresenter;

export class UpdateUserByIdController {
  private usecase: UpdateUserByIdUsecase;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    updateUserRepository: IUpdateUserRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new UpdateUserByIdUsecase(
      getUserByIdRepository,
      updateUserRepository
    );
  }

  async execute(
    request: UpdateUserByIdRequest
  ): Promise<UpdateUserByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id, paramsToUpdate } = request;

    const { name, type, enabled, email } = paramsToUpdate;

    const hasErrors = this.validation.validate({
      id,
      name,
      email,
      type,
      enabled,
    });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const userUpdated = await this.usecase.execute({ id, paramsToUpdate });

    console.log({ message: 'User updated', data: userUpdated });

    const userPresenter =
      UserTransformers.generateDefaultTransformer(userUpdated);

    return userPresenter;
  }
}
