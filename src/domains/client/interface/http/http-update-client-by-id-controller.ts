import {
  IUpdateClientRepository,
  IGetClientByIdRepository,
  IGetClientByNameRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientNotFoundException,
  ClientAlreadyExistsException,
} from '@/domains/client/usecases/exceptions';
import {
  UpdateClientByIdController,
} from '@/domains/client/interface/controllers';

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

export interface HttpUpdateClientByIdRequest {
  id: string;
  name?: string;
  contact?: string;
  address?: string;
}

export class HttpUpdateClientByIdController implements HttpController {
  private controller: UpdateClientByIdController;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    getClientByNameRepository: IGetClientByNameRepository,
    updateClientRepository: IUpdateClientRepository,
    validation: Validation,

  ) {
    this.controller = new UpdateClientByIdController(
      getClientByIdRepository,
      getClientByNameRepository,
      updateClientRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpUpdateClientByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id, ...paramsToUpdate } = httpRequest;

    const request = {
      id,
      paramsToUpdate,
    };

    try {
      const clientUpdated = await this.controller.execute(request);

      console.log({
        message: 'Client updated',
        data: clientUpdated,
      });

      return ok(clientUpdated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ClientAlreadyExistsException) {
        return badRequest(error);
      }

      if (error instanceof ClientNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
