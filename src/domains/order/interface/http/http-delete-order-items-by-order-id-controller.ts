import {
  IDeleteOrderItemsByOrderIdRepository,
  IGetOrderItemsByOrderIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderItemNotFoundException
} from '@/domains/order/usecases/exceptions';
import {
  DeleteOrderItemsByOrderIdController,
} from '@/domains/order/interface/controllers';

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

export interface HttpDeleteOrderItemsByOrderIdRequest {
  id: string;
}

export class HttpDeleteOrderItemsByOrderIdController implements HttpController {
  private controller: DeleteOrderItemsByOrderIdController;


  constructor(
    getOrderItemsByOrderIdRepository: IGetOrderItemsByOrderIdRepository,
    deleteOrderItemsByOrderIdRepository: IDeleteOrderItemsByOrderIdRepository,
    validation: Validation,

  ) {
    this.controller = new DeleteOrderItemsByOrderIdController(
      getOrderItemsByOrderIdRepository,
      deleteOrderItemsByOrderIdRepository,
      validation,
    );

  }

  async handle(
    httpRequest: HttpDeleteOrderItemsByOrderIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      console.log({
        message: 'OrderItems deleted',
        data: { id },
      });

      return noContent();
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof OrderItemNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
