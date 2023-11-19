import {
  IGetUserByEmailInCloudRepository,
  IGetUserByIdRepository,
} from '@/domains/user/usecases/repos';
import { UserNotFoundException } from '@/domains/user/usecases/exceptions';
import { GetUserByIdController } from '@/domains/user/interface/controllers';

import {
  ok,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';
import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';
export interface HttpGetUserByIdRequest {
  id: string;
}

export class HttpGetUserByIdController implements HttpController {
  private controller: GetUserByIdController;

  constructor(
    getUserByIdRepository: IGetUserByIdRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    validation: Validation
  ) {
    this.controller = new GetUserByIdController(
      getUserByIdRepository,
      getUserByEmailInCloudRepository,
      validation
    );
  }

  async handle(httpRequest: HttpGetUserByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      const user = await this.controller.execute({ id });

      console.log({ message: 'User found', data: user });

      if (!user) {
        return notFound(new UserNotFoundException({ id }));
      }

      return ok(user);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
