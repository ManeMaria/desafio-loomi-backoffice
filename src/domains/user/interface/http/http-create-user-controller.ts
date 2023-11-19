import {
  IDeleteUserByIdRepository,
  IGetUserByEmailInCloudRepository,
  IGetUserByEmailRepository,
  ISaveUserInCloudRepository,
  ISaveUserRepository,
} from '@/domains/user/usecases/repos';
import { UserAlreadyExistsException } from '@/domains/user/usecases/exceptions';
import { CreateUserController } from '@/domains/user/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';
import {
  badRequest,
  created,
  serverError,
} from '@/shared/interface/http/helpers';

export interface HttpCreateUserRequest {
  name: string;
  email: string;
  type: string;
}

export class HttpCreateUserController implements HttpController {
  private controller: CreateUserController;

  constructor(
    getUserByEmailRepository: IGetUserByEmailRepository,
    getUserByEmailInCloudRepository: IGetUserByEmailInCloudRepository,
    uuidGenerator: IUuidGenerator,
    saveUserRepository: ISaveUserRepository,
    saveUserInCloudRepository: ISaveUserInCloudRepository,
    deleteUserByIdRepository: IDeleteUserByIdRepository,
    validation: Validation
  ) {
    this.controller = new CreateUserController(
      getUserByEmailRepository,
      getUserByEmailInCloudRepository,
      uuidGenerator,
      saveUserRepository,
      saveUserInCloudRepository,
      deleteUserByIdRepository,
      validation
    );
  }

  async handle(httpRequest: HttpCreateUserRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { name, email, type } = httpRequest;

    try {
      const userCreated = await this.controller.execute({
        name,
        email,
        type,
      });

      console.log({ message: 'User created', data: userCreated });

      return created(userCreated);
    } catch (error) {
      if (
        error instanceof ValidationException ||
        error instanceof UserAlreadyExistsException
      ) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
