import {
  IGetClientsByFilterRepository,
  ICountClientsByFilterRepository,
} from '@/domains/client/usecases/repos';
import {
  GetClientsByFilterController,
} from '@/domains/client/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';

import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';
import { DateFilter, OrderByMode, ValidationException } from '@/shared/helpers';

export type HttpGetClientsByFilterRequest = {
  name?: string;
  contact?: string;
  address?: string;
  enabled?: boolean;
  created_at?: DateFilter;
  updated_at?: DateFilter;
  order_by: {
    property?: string;
    mode?: OrderByMode;
  };
  take?: number;
  skip?: number;
  count?: boolean;
};

export class HttpGetClientsByFilterController implements HttpController {
  private controller: GetClientsByFilterController;


  constructor(
    getClientsByFilterRepository: IGetClientsByFilterRepository,
    countClientsByFilterRepository: ICountClientsByFilterRepository,
    validation: Validation,

  ) {
    this.controller = new GetClientsByFilterController(
      getClientsByFilterRepository,
      countClientsByFilterRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpGetClientsByFilterRequest,
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      name,
      address,
      contact,
      enabled,
      created_at: createdAt,
      updated_at: updatedAt,
      order_by: orderBy,
      take,
      skip,
      count,

    } = httpRequest;

    try {
      const clients = await this.controller.execute({
        name,
        address,
        contact,
        enabled,
        createdAt,
        updatedAt,
        orderBy,
        take,
        skip,
        count,
      });

      console.log({ message: 'Clients found' });

      return ok(clients);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
