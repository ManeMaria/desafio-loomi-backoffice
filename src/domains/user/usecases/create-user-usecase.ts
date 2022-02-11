import {
  User,
  UserTransformer,
  IGetUserByEmailRepository,
  IGetUserByEmailInCloudRepository,
  ISaveUserRepository,
  ISaveUserInCloudRepository,
  IDeleteUserByIdRepository,
  UserAlreadyExistsException,
} from '@/domains/user';
import { ILoggerLocal } from '@/shared/protocols';

import { IUuidGenerator } from '@/shared/protocols/uuid-generator';

export interface ICreateUserUsecase {
  execute(
    params: ICreateUserUsecase.Params
  ): Promise<ICreateUserUsecase.Response>;
}

export namespace ICreateUserUsecase {
  export type Params = {
    name: string;
    email: string;
    isAdmin?: boolean;
  };

  export type Response = User;
}

export class CreateUserUsecase implements ICreateUserUsecase {
  private logger: ILoggerLocal;

  constructor(
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    private readonly uuidGenerator: IUuidGenerator,
    private readonly saveUserRepository: ISaveUserRepository,
    private readonly saveUserInCloudRepository: ISaveUserInCloudRepository,
    private readonly deleteUserByIdRepository: IDeleteUserByIdRepository,
    logger: ILoggerLocal
  ) {
    this.logger = logger.child({ usecase: 'create-user' });
  }

  async execute(
    params: ICreateUserUsecase.Params
  ): Promise<ICreateUserUsecase.Response> {
    this.logger.logDebug({ message: 'Request received', data: params });

    const { name, email, isAdmin } = params;

    const userExists = await this.getUserByEmailRepository.getByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsException({ name, email, isAdmin });
    }

    const userExistsInCloud =
      await this.getUserByEmailInCloudRepository.getByEmail(email);

    if (userExistsInCloud) {
      throw new UserAlreadyExistsException({ name, email, isAdmin });
    }

    const id = this.uuidGenerator.generate();

    const user = new User({ id, name, email, isAdmin });

    const userDTO = UserTransformer.generateDTO(user);

    const userCreatedDTO = await this.saveUserRepository.save(userDTO);

    this.logger.logDebug({
      message: 'User created in database',
      data: userCreatedDTO,
    });

    try {
      await this.saveUserInCloudRepository.save({ email });

      this.logger.logDebug({ message: 'User created in cloud' });
    } catch (error) {
      this.logger.logDebug({ message: 'User deleted', data: { id } });

      await this.deleteUserByIdRepository.delete(id);

      throw error;
    }

    const userCreated = new User(userCreatedDTO);

    this.logger.logDebug({ message: 'User created', data: userCreated });

    return userCreated;
  }
}
