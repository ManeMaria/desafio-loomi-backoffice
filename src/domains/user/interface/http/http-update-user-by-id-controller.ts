import {
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from '@/domains/user/usecases/repos';
import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import { UpdateUserByIdController } from '@/domains/user/interface/controllers';

import {
  ok,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';
import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpUpdateUserByIdRequest {
  id: string;
  name?: string;
  email?: string;
  type?: string;
  enabled?: boolean;
}

export class HttpUpdateUserByIdController implements HttpController {
  private controller: UpdateUserByIdController;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    updateUserRepository: IUpdateUserRepository,
    validation: Validation
  ) {
    this.controller = new UpdateUserByIdController(
      getUserByIdRepository,
      updateUserRepository,
      validation
    );
  }

  async handle(httpRequest: HttpUpdateUserByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request received', data: httpRequest });

    const { id, name, type, enabled, email } = httpRequest;

    const request = {
      id,
      paramsToUpdate: {
        name,
        email,
        type,
        enabled,
      },
    };

    try {
      const userUpdated = await this.controller.execute(request);

      console.log({ message: 'User updated', data: userUpdated });

      return ok(userUpdated);
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
