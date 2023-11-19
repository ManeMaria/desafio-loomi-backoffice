import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import {
  IGetUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IDeleteUserByEmailInCloudRepository,
  IDeleteUserByIdRepository,
} from '@/domains/user/usecases/repos';

export interface IDeleteUserByIdUsecase {
  execute(
    id: IDeleteUserByIdUsecase.Params
  ): Promise<IDeleteUserByIdUsecase.Result>;
}

export namespace IDeleteUserByIdUsecase {
  export type Params = string;
  export type Result = void;
}

export class DeleteUserByIdUsecase implements IDeleteUserByIdUsecase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    private readonly deleteUserByEmailInCloudRepository: IDeleteUserByEmailInCloudRepository,
    private readonly deleteUserByIdRepository: IDeleteUserByIdRepository
  ) {}

  async execute(
    id: IDeleteUserByIdUsecase.Params
  ): Promise<IDeleteUserByIdUsecase.Result> {
    console.log({ message: 'Request Received', data: { id } });

    const userExists = await this.getUserByIdRepository.getById(id);

    if (!userExists) {
      throw new UserNotFoundException({ id });
    }

    console.log({
      message: 'User found in database',
      data: userExists,
    });

    const { email } = userExists;

    const userExistsInCloud =
      await this.getUserByEmailInCloudRepository.getByEmail(email);

    if (!userExistsInCloud) {
      throw new UserNotFoundException({ email });
    }

    console.log({
      message: 'User found in cloud',
      data: userExistsInCloud,
    });

    await this.deleteUserByEmailInCloudRepository.delete(email);

    console.log({
      message: 'User deleted from cloud',
      data: { email },
    });

    await this.deleteUserByIdRepository.delete(id);

    console.log({
      message: 'User delete from database',
      data: { id },
    });
  }
}
