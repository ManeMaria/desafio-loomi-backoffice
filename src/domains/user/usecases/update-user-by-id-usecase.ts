import { User, UserTypeEnum } from '@/domains/user/entities';
import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import {
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from '@/domains/user/usecases/repos';

export interface IUpdateUserByIdUsecase {
  execute(
    updateParams: IUpdateUserByIdUsecase.Params
  ): Promise<IUpdateUserByIdUsecase.Result>;
}

export namespace IUpdateUserByIdUsecase {
  export type Params = {
    id: string;
    paramsToUpdate: {
      name?: string;
      email?: string;
      type?: string;
      enabled?: boolean;
    };
  };
  export type Result = User;
}

export class UpdateUserByIdUsecase implements IUpdateUserByIdUsecase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly updateUserRepository: IUpdateUserRepository
  ) { }

  async execute(
    updateParams: IUpdateUserByIdUsecase.Params
  ): Promise<IUpdateUserByIdUsecase.Result> {
    console.log({ message: 'Request received', data: updateParams });

    const { id, paramsToUpdate } = updateParams;

    const userExists = await this.getUserByIdRepository.getById(id);

    if (!userExists) {
      throw new UserNotFoundException({ id });
    }

    console.log({ message: 'User found', data: userExists });


    const userToUpdate = new User({ ...userExists, ...paramsToUpdate, ...(paramsToUpdate.type && { type: paramsToUpdate.type }) as unknown as { type: UserTypeEnum } });

    const userUpdated = await this.updateUserRepository.update({
      ...userToUpdate,
    });

    console.log({ message: 'User updated', data: userUpdated });

    return userUpdated;
  }
}
