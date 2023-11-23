import {
  IDeleteOrderByIdRepository,
  IGetOrderByIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderNotFoundException,
} from '@/domains/order/usecases/exceptions';
import {
  DeleteOrderByIdController,
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

export interface HttpDeleteOrderByIdRequest {
  id: string;
}

export class HttpDeleteOrderByIdController implements HttpController {
  private controller: DeleteOrderByIdController;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    deleteOrderByIdRepository: IDeleteOrderByIdRepository,
    validation: Validation,

  ) {
    this.controller = new DeleteOrderByIdController(
      getOrderByIdRepository,
      deleteOrderByIdRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpDeleteOrderByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      console.log({
        message: 'Order deleted',
        data: { id },
      });

      return noContent();
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof OrderNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
