import {
  IGetUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IDeleteUserByEmailInCloudRepository,
  IDeleteUserByIdRepository,
  UserNotFoundException,
} from '@/domains/user';
import { ILoggerLocal } from '@/shared/protocols';

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
  private logger: ILoggerLocal;

  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    private readonly deleteUserByEmailInCloudRepository: IDeleteUserByEmailInCloudRepository,
    private readonly deleteUserByIdRepository: IDeleteUserByIdRepository,
    logger: ILoggerLocal
  ) {
    this.logger = logger.child({ usecase: 'delete-user-by-id' });
  }

  async execute(
    id: IDeleteUserByIdUsecase.Params
  ): Promise<IDeleteUserByIdUsecase.Result> {
    this.logger.logDebug({ message: 'Request Received', data: { id } });

    const userExists = await this.getUserByIdRepository.getById(id);

    if (!userExists) {
      throw new UserNotFoundException({ id });
    }

    this.logger.logDebug({
      message: 'User found in database',
      data: userExists,
    });

    const { email } = userExists;

    const userExistsInCloud =
      await this.getUserByEmailInCloudRepository.getByEmail(email);

    if (!userExistsInCloud) {
      throw new UserNotFoundException({ email });
    }

    this.logger.logDebug({
      message: 'User found in cloud',
      data: userExistsInCloud,
    });

    await this.deleteUserByEmailInCloudRepository.delete(email);

    this.logger.logDebug({
      message: 'User deleted from cloud',
      data: { email },
    });

    await this.deleteUserByIdRepository.delete(id);

    this.logger.logDebug({
      message: 'User delete from database',
      data: { id },
    });
  }
}
