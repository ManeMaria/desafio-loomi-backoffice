import {
  ISaveClientRepository,
  IGetClientByNameRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientAlreadyExistsException,
} from '@/domains/client/usecases/exceptions';
import {
  CreateClientController,
} from '@/domains/client/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, created, serverError } from '@/shared/interface/http/helpers';
import { IUuidGenerator } from '@/shared/protocols';

export interface HttpCreateClientRequest {
  name: string;
  contact: string;
  address: string;
}

export class HttpCreateClientController implements HttpController {
  private controller: CreateClientController;


  constructor(
    getClientByNameRepository: IGetClientByNameRepository,
    saveClientRepository: ISaveClientRepository,
    uuidGenerator: IUuidGenerator,
    validation: Validation,

  ) {
    this.controller = new CreateClientController(
      getClientByNameRepository,
      saveClientRepository,
      uuidGenerator,
      validation,

    );


  }

  async handle(httpRequest: HttpCreateClientRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });



    try {
      const clientCreated = await this.controller.execute({
        ...httpRequest
      });

      console.log({
        message: 'Client created',
        data: clientCreated,
      });

      return created(clientCreated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ClientAlreadyExistsException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
