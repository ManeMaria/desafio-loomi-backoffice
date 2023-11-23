import {
  IUpdateOrderRepository,
  IGetOrderByIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderNotFoundException,
  OrderAlreadyExistsException,
} from '@/domains/order/usecases/exceptions';
import {
  UpdateOrderByIdController,
} from '@/domains/order/interface/controllers';

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

export interface HttpUpdateOrderByIdRequest {
  id: string;
  status?: string;
  totalOrder?: number;
  createdAt?: Date;
}

export class HttpUpdateOrderByIdController implements HttpController {
  private controller: UpdateOrderByIdController;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    updateOrderRepository: IUpdateOrderRepository,
    validation: Validation,

  ) {
    this.controller = new UpdateOrderByIdController(
      getOrderByIdRepository,
      updateOrderRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpUpdateOrderByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id, status, createdAt, totalOrder } = httpRequest;

    const request = {
      id,
      paramsToUpdate: {
        status,
        createdAt,
        totalOrder
      },
    };

    try {
      const orderUpdated = await this.controller.execute(request);

      console.log({
        message: 'Order updated',
        data: orderUpdated,
      });

      return ok(orderUpdated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof OrderAlreadyExistsException) {
        return badRequest(error);
      }

      if (error instanceof OrderNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
