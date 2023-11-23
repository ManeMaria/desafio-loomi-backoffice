import {
  IGetOrdersByFilterRepository,
  ICountOrdersByFilterRepository,
} from '@/domains/order/usecases/repos';
import {
  GetOrdersByFilterController,
} from '@/domains/order/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';

import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';
import { OrderByMode, ValidationException } from '@/shared/helpers';

export type HttpGetOrdersByFilterRequest = {
  status?: string;
  totalOrder?: number;
  created_at?: Date;
  updated_at?: Date;
  order_by: {
    property?: string;
    mode?: OrderByMode;
  };
  take?: number;
  skip?: number;
  count?: boolean;
};

export class HttpGetOrdersByFilterController implements HttpController {
  private controller: GetOrdersByFilterController;


  constructor(
    getOrdersByFilterRepository: IGetOrdersByFilterRepository,
    countOrdersByFilterRepository: ICountOrdersByFilterRepository,
    validation: Validation,

  ) {
    this.controller = new GetOrdersByFilterController(
      getOrdersByFilterRepository,
      countOrdersByFilterRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpGetOrdersByFilterRequest,
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      status,
      totalOrder,
      created_at: createdAt,
      updated_at: updatedAt,
      order_by: orderBy,
      take,
      skip,
      count,
    } = httpRequest;

    try {
      const orders = await this.controller.execute({
        status,
        totalOrder,
        createdAt,
        updatedAt,
        orderBy,
        take,
        skip,
        count,
      });

      console.log({ message: 'Orders found' });

      return ok(orders);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
