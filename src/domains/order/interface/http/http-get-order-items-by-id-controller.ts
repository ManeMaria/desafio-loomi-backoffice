import {
  IGetOrderItemsByOrderIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderItemNotFoundException
} from '@/domains/order/usecases/exceptions';
import {
  GetOrderItemsByOrderIdController,
} from '@/domains/order/interface/controllers';

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

export interface HttpGetOrderItemsByOrderIdRequest {
  id: string;
}

export class HttpGetOrderItemsByOrderIdController implements HttpController {
  private controller: GetOrderItemsByOrderIdController;


  constructor(
    getOrderItemsByOrderIdRepository: IGetOrderItemsByOrderIdRepository,
    validation: Validation,

  ) {
    this.controller = new GetOrderItemsByOrderIdController(
      getOrderItemsByOrderIdRepository,
      validation,

    );


  }

  async handle(httpRequest: HttpGetOrderItemsByOrderIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      const orderItems = await this.controller.execute({ id });

      console.log({
        message: 'OrderItems found',
        data: orderItems,
      });

      if (!orderItems) {
        return notFound(new OrderItemNotFoundException({ id }));
      }

      return ok(orderItems);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
