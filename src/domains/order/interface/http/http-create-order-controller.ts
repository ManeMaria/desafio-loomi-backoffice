import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  PrismaGetProductByIdGateways,
  PrismaUpdateProductGateways
} from '@/domains/order/infra/prisma/gateways';
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
import { ICreateOrderItemsUsecase } from '@/domains/order/usecases';
import { IStripePaymentIntentClass } from '@/main/infra/fake-stripe';

export interface HttpCreateOrderRequest {
  status: string;
  totalOrder: number;
  clientId: string;
  orderItems: {
    quantity: number;
    costPerItem: number;
    productId: string;
  }[];
}

export class HttpCreateOrderController implements HttpController {
  private controller: CreateOrderController;


  constructor(
    saveOrderRepository: ISaveOrderRepository,
    createOrderItemsUsecase: ICreateOrderItemsUsecase,
    paymentIntentService: IStripePaymentIntentClass,
    prismaGetProductByIdGetaways: PrismaGetProductByIdGateways,
    prismaUpdateProductGetaways: PrismaUpdateProductGateways,
    uuidGenerator: IUuidGenerator,
    validation: Validation,
    orderItemsValidation: Validation,
  ) {
    this.controller = new CreateOrderController(
      saveOrderRepository,
      createOrderItemsUsecase,
      paymentIntentService,
      prismaGetProductByIdGetaways,
      prismaUpdateProductGetaways,
      uuidGenerator,
      validation,
      orderItemsValidation
    );


  }

  async handle(httpRequest: HttpCreateOrderRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { clientId, status, totalOrder, orderItems } = httpRequest;

    try {
      const orderCreated = await this.controller.execute({
        clientId, status, totalOrder, orderItems
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
