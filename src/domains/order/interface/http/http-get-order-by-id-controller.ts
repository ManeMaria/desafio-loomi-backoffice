import {
  IGetOrderByIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderNotFoundException,
} from '@/domains/order/usecases/exceptions';
import {
  GetOrderByIdController,
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

export interface HttpGetOrderByIdRequest {
  id: string;
}

export class HttpGetOrderByIdController implements HttpController {
  private controller: GetOrderByIdController;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    validation: Validation,

  ) {
    this.controller = new GetOrderByIdController(
      getOrderByIdRepository,
      validation,

    );


  }

  async handle(httpRequest: HttpGetOrderByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      const order = await this.controller.execute({ id });

      console.log({
        message: 'Order found',
        data: order,
      });

      if (!order) {
        return notFound(new OrderNotFoundException({ id }));
      }

      return ok(order);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
