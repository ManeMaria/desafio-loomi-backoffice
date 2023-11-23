import {
  IGetProductsByFilterRepository,
  ICountProductsByFilterRepository,
} from '@/domains/product/usecases/repos';
import {
  GetProductsByFilterController,
} from '@/domains/product/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';

import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';
import { DateFilter, OrderByMode, ValidationException } from '@/shared/helpers';

export type HttpGetProductsByFilterRequest = {
  name?: string;
  description?: string;
  cost?: number;
  quantity?: number;
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

export class HttpGetProductsByFilterController implements HttpController {
  private controller: GetProductsByFilterController;


  constructor(
    getProductsByFilterRepository: IGetProductsByFilterRepository,
    countProductsByFilterRepository: ICountProductsByFilterRepository,
    validation: Validation,

  ) {
    this.controller = new GetProductsByFilterController(
      getProductsByFilterRepository,
      countProductsByFilterRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpGetProductsByFilterRequest,
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      name,
      description,
      enabled,
      cost,
      quantity,
      created_at: createdAt,
      updated_at: updatedAt,
      order_by: orderBy,
      take,
      skip,
      count,
    } = httpRequest;

    try {
      const products = await this.controller.execute({
        name,
        description,
        enabled,
        cost,
        quantity,
        createdAt,
        updatedAt,
        orderBy,
        take,
        skip,
        count,
      });

      console.log({ message: 'Products found' });

      return ok(products);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
