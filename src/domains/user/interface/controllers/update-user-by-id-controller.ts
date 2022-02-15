import { Validation } from '@/shared/interface/validation/protocols';
import {
  IGetUserByIdRepository,
  IUpdateUserRepository,
  UpdateUserByIdUsecase,
  UserDTO,
  UserTransformer,
} from '@/domains/user';
import { ValidationException } from '@/shared/helpers';
import { ILoggerLocal } from '@/shared/protocols';

export interface UpdateUserByIdRequest {
  id: string;
  paramsToUpdate: {
    name?: string;
    isAdmin?: boolean;
    enabled?: boolean;
  };
}

export type UpdateUserByIdResponse = UserDTO;

export class UpdateUserByIdController {
  private usecase: UpdateUserByIdUsecase;
  private logger: ILoggerLocal;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    updateUserRepository: IUpdateUserRepository,
    private readonly validation: Validation,
    logger: ILoggerLocal
  ) {
    this.usecase = new UpdateUserByIdUsecase(
      getUserByIdRepository,
      updateUserRepository,
      logger
    );

    this.logger = logger.child({ controller: 'update-user-by-id' });
  }

  async execute(
    request: UpdateUserByIdRequest
  ): Promise<UpdateUserByIdResponse> {
    this.logger.logDebug({ message: 'Request received', data: request });

    const { id, paramsToUpdate } = request;

    const { name, isAdmin, enabled } = paramsToUpdate;

    const hasErrors = this.validation.validate({
      id,
      name,
      isAdmin,
      enabled,
    });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    this.logger.logDebug({ message: 'Params validated' });

    const userUpdated = await this.usecase.execute({ id, paramsToUpdate });

    const userUpdatedDTO = UserTransformer.generateDTO(userUpdated);

    this.logger.logDebug({ message: 'User updated', data: userUpdatedDTO });

    return userUpdatedDTO;
  }
}
