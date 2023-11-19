import { DeleteUserByIdUsecase } from '@/domains/user/usecases';
import {
  IGetUserByIdRepository,
  IDeleteUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IDeleteUserByEmailInCloudRepository,
} from '@/domains/user/usecases/repos';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface DeleteUserByIdRequest {
  id: string;
}

export type DeleteUserByIdResponse = void;

export class DeleteUserByIdController {
  private usecase: DeleteUserByIdUsecase;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    deleteUserByEmailInCloudRepository: IDeleteUserByEmailInCloudRepository,
    deleteUserByIdRepository: IDeleteUserByIdRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new DeleteUserByIdUsecase(
      getUserByIdRepository,
      getUserByEmailInCloudRepository,
      deleteUserByEmailInCloudRepository,
      deleteUserByIdRepository
    );
  }

  async execute(
    request: DeleteUserByIdRequest
  ): Promise<DeleteUserByIdResponse> {
    console.log({ message: 'Request Received', data: request });
    const { id } = request;

    const hasError = this.validation.validate({ id });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    await this.usecase.execute(id);

    console.log({ message: 'User deleted', data: { id } });
  }
}
