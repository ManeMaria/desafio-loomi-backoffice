import { User } from '@/domains/user/entities';
import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import {
  IGetUserByIdRepository,
  IGetUserByEmailInCloudRepository,
} from '@/domains/user/usecases/repos';

export interface IGetUserbyIdUsecase {
  execute(id: IGetUserbyIdUsecase.Params): Promise<IGetUserbyIdUsecase.Result>;
}

export namespace IGetUserbyIdUsecase {
  export type Params = string;
  export type Result = User | null;
}

export class GetUserByIdUsecase implements IGetUserbyIdUsecase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository
  ) {}

  async execute(
    id: IGetUserbyIdUsecase.Params
  ): Promise<IGetUserbyIdUsecase.Result> {
    console.log({ message: 'Request Received', data: { id } });

    const userExists = await this.getUserByIdRepository.getById(id);

    if (!userExists) return null;

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

    console.log({
      message: 'User found',
      data: userExists,
    });

    return userExists;
  }
}
