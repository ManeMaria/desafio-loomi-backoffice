import { CreateUserUsecase } from '@/domains/user/usecases';
import {
  ISaveUserRepository,
  IGetUserByEmailRepository,
  IDeleteUserByIdRepository,
  ISaveUserInCloudRepository,
  IGetUserByEmailInCloudRepository,
} from '@/domains/user/usecases/repos';
import {
  UserDefaultPresenter,
  UserTransformers,
} from '@/domains/user/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';


export interface CreateUserRequest {
  name: string;
  email: string;
  type: string;
}

export type CreateUserResponse = UserDefaultPresenter;

export class CreateUserController {
  private usecase: CreateUserUsecase;

  constructor(
    getUserByEmailRepository: IGetUserByEmailRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    uuidGenerator: IUuidGenerator,
    saveUserRepository: ISaveUserRepository,
    saveUserInCloudRepository: ISaveUserInCloudRepository,
    deleteUserByIdRepository: IDeleteUserByIdRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new CreateUserUsecase(
      getUserByEmailRepository,
      getUserByEmailInCloudRepository,
      uuidGenerator,
      saveUserRepository,
      saveUserInCloudRepository,
      deleteUserByIdRepository
    );
  }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    console.log({ message: 'Request Received', data: request });

    const { name, email, type } = request;

    const hasError = this.validation.validate({
      name,
      email,
      type,
    });

    console.log({ message: 'Params validated' });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    const userCreated = await this.usecase.execute({ name, email, type });

    console.log({ message: 'User created', data: userCreated });

    const userPresenter =
      UserTransformers.generateDefaultTransformer(userCreated);

    return userPresenter;
  }
}
