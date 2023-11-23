import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderAlreadyExistsException,
} from '@/domains/order/usecases/exceptions';
import {
  CreateOrderController,
} from '@/domains/order/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, created, serverError } from '@/shared/interface/http/helpers';
import { IUuidGenerator } from '@/shared/protocols';

export interface HttpCreateOrderRequest {
  status: string;
  totalOrder: number;
  clientId: string;

}

export class HttpCreateOrderController implements HttpController {
  private controller: CreateOrderController;


  constructor(
    saveOrderRepository: ISaveOrderRepository,
    uuidGenerator: IUuidGenerator,
    validation: Validation,

  ) {
    this.controller = new CreateOrderController(
      saveOrderRepository,
      uuidGenerator,
      validation,

    );


  }

  async handle(httpRequest: HttpCreateOrderRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { clientId, status, totalOrder } = httpRequest;

    try {
      const orderCreated = await this.controller.execute({
        clientId, status, totalOrder
      });

      console.log({
        message: 'Order created',
        data: orderCreated,
      });

      return created(orderCreated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof OrderAlreadyExistsException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
