import {
  DeleteUserByIdController,
  IDeleteUserByEmailInCloudRepository,
  IDeleteUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IGetUserByIdRepository,
  UserNotFoundException,
} from '@/domains/user';
import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { Validation } from '@/shared/interface/validation/protocols';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '@/shared/interface/http/helpers';
import { ValidationException } from '@/shared/helpers';
import { ILoggerLocal } from '@/shared/protocols';
import { CognitoException } from '@/shared/infra/cognito';

export interface HttpDeleteUserByIdRequest {
  id: string;
}

export class HttpDeleteUserByIdController implements HttpController {
  private controller: DeleteUserByIdController;
  private logger: ILoggerLocal;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    deleteUserByEmailInCloudRepository: IDeleteUserByEmailInCloudRepository,
    deleteUserByIdRepository: IDeleteUserByIdRepository,
    validation: Validation,
    logger: ILoggerLocal
  ) {
    this.controller = new DeleteUserByIdController(
      getUserByIdRepository,
      getUserByEmailInCloudRepository,
      deleteUserByEmailInCloudRepository,
      deleteUserByIdRepository,
      validation,
      logger
    );

    this.logger = logger.child({ httpController: 'delete-user-by-id' });
  }

  async handle(httpRequest: HttpDeleteUserByIdRequest): Promise<HttpResponse> {
    this.logger.logDebug({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      this.logger.logDebug({ message: 'User deleted', data: { id } });

      return ok();
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof CognitoException
      ) {
        return badRequest(error);
      }

      if (error instanceof UserNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
