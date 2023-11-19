import {
  IDeleteUserByEmailInCloudRepository,
  IDeleteUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IGetUserByIdRepository,
} from '@/domains/user/usecases/repos';
import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import { DeleteUserByIdController } from '@/domains/user/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';
import {
  noContent,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpDeleteUserByIdRequest {
  id: string;
}

export class HttpDeleteUserByIdController implements HttpController {
  private controller: DeleteUserByIdController;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    deleteUserByEmailInCloudRepository: IDeleteUserByEmailInCloudRepository,
    deleteUserByIdRepository: IDeleteUserByIdRepository,
    validation: Validation
  ) {
    this.controller = new DeleteUserByIdController(
      getUserByIdRepository,
      getUserByEmailInCloudRepository,
      deleteUserByEmailInCloudRepository,
      deleteUserByIdRepository,
      validation
    );
  }

  async handle(httpRequest: HttpDeleteUserByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      console.log({ message: 'User deleted', data: { id } });

      return noContent();
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof UserNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
