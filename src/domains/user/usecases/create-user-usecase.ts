import { User } from '@/domains/user/entities';
import { UserAlreadyExistsException } from '@/domains/user/usecases/exceptions';
import {
  IGetUserByEmailRepository,
  IGetUserByEmailInCloudRepository,
  ISaveUserRepository,
  ISaveUserInCloudRepository,
  IDeleteUserByIdRepository,
} from '@/domains/user/usecases/repos';

import { IUuidGenerator } from '@/shared/protocols';
export interface ICreateUserUsecase {
  execute(
    params: ICreateUserUsecase.Params
  ): Promise<ICreateUserUsecase.Response>;
}

export namespace ICreateUserUsecase {
  export type Params = {
    name: string;
    email: string;
    type: string;
  };

  export type Response = User;
}

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor(
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    private readonly uuidGenerator: IUuidGenerator,
    private readonly saveUserRepository: ISaveUserRepository,
    private readonly saveUserInCloudRepository: ISaveUserInCloudRepository,
    private readonly deleteUserByIdRepository: IDeleteUserByIdRepository
  ) { }

  async execute(
    params: ICreateUserUsecase.Params
  ): Promise<ICreateUserUsecase.Response> {
    console.log({ message: 'Request received', data: params });

    const { name, email, type } = params;


    const userExists = await this.getUserByEmailRepository.getByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsException({ name, email });
    }

    const userExistsInCloud =
      await this.getUserByEmailInCloudRepository.getByEmail(email);

    if (userExistsInCloud) {
      throw new UserAlreadyExistsException({ name, email });
    }

    const id = this.uuidGenerator.generate();

    const user = new User({ id, name, email, type });

    const userCreated = await this.saveUserRepository.save({
      ...user,
    });

    console.log({
      message: 'User created in database',
      data: userCreated,
    });

    try {
      await this.saveUserInCloudRepository.save({ email, name: `${email}_${id}` });

      console.log({ message: 'User created in cloud' });
    } catch (error) {
      console.log({ message: 'User deleted', data: { id } });

      await this.deleteUserByIdRepository.delete(id);

      throw error;
    }

    console.log({ message: 'User created', data: userCreated });

    return userCreated;
  }
}
