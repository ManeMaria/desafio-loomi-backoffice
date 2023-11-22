import {
  IGetClientByIdRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientNotFoundException,
} from '@/domains/client/usecases/exceptions';
import {
  GetClientByIdController,
} from '@/domains/client/interface/controllers';

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

export interface HttpGetClientByIdRequest {
  id: string;
}

export class HttpGetClientByIdController implements HttpController {
  private controller: GetClientByIdController;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    validation: Validation,

  ) {
    this.controller = new GetClientByIdController(
      getClientByIdRepository,
      validation,

    );


  }

  async handle(httpRequest: HttpGetClientByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      const client = await this.controller.execute({ id });

      console.log({
        message: 'Client found',
        data: client,
      });

      if (!client) {
        return notFound(new ClientNotFoundException({ id }));
      }

      return ok(client);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
