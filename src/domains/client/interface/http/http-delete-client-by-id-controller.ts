import {
  IDeleteClientByIdRepository,
  IGetClientByIdRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientNotFoundException,
} from '@/domains/client/usecases/exceptions';
import {
  DeleteClientByIdController,
} from '@/domains/client/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import {
  noContent,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';

import { Validation } from '@/shared/interface/validation/protocols';
import { ValidationException } from '@/shared/helpers';

export interface HttpDeleteClientByIdRequest {
  id: string;
}

export class HttpDeleteClientByIdController implements HttpController {
  private controller: DeleteClientByIdController;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    deleteClientByIdRepository: IDeleteClientByIdRepository,
    validation: Validation,

  ) {
    this.controller = new DeleteClientByIdController(
      getClientByIdRepository,
      deleteClientByIdRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpDeleteClientByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      console.log({
        message: 'Client deleted',
        data: { id },
      });

      return noContent();
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ClientNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
