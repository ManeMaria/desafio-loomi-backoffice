import {
  CreateOrderUsecase,
  ICreateOrderItemsUsecase,
} from '@/domains/order/usecases';
import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  PrismaGetProductByIdGateways,
  PrismaUpdateProductGateways
} from '@/domains/order/infra/prisma/gateways';
import {
  OrderDefaultPresenter,
  OrderTransformers,
} from '@/domains/order/interface/presenters';

import { DefaultException, ExceptionTypes } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';
import { IStripePaymentIntentClass } from '@/main/infra/fake-stripe';


export interface CreateOrderRequest {
  status: string;
  totalOrder: number;
  clientId: string;
  orderItems: {
    quantity: number;
    costPerItem: number;
    productId: string;
  }[];
}

export type CreateOrderResponse = OrderDefaultPresenter;

export class CreateOrderController {
  private usecase: CreateOrderUsecase;


  constructor(
    saveOrderRepository: ISaveOrderRepository,
    createOrderItemsUsecase: ICreateOrderItemsUsecase,
    paymentIntentService: IStripePaymentIntentClass,
    prismaGetProductByIdGetaways: PrismaGetProductByIdGateways,
    prismaUpdateProductGetaways: PrismaUpdateProductGateways,
    uuidGenerator: IUuidGenerator,
    private readonly validation: Validation,
    private readonly orderItemsValidation: Validation,
  ) {
    this.usecase = new CreateOrderUsecase(
      saveOrderRepository,
      createOrderItemsUsecase,
      paymentIntentService,
      prismaGetProductByIdGetaways,
      prismaUpdateProductGetaways,
      uuidGenerator,
    );

  }

  async execute(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    console.log({ message: 'Request received', data: request });

    const { clientId, status, totalOrder, orderItems } = request;



    const hasError = this.validation.validate({
      clientId, status, totalOrder
    });

    if (hasError) {
      throw new DefaultException({
        type: ExceptionTypes.ORDER,
        code: 'VALIDATION',
        data: hasError,
      });
    }

    const hasErrorOrderItems = this.mapOrderItemsValidation(orderItems);


    if (hasErrorOrderItems) {
      throw new DefaultException({
        type: ExceptionTypes.ORDER_ITEM,
        code: 'VALIDATION',
        data: hasErrorOrderItems,
      });
    }

    console.log({ message: 'Params validated' });

    const orderCreated = await this.usecase.execute({ clientId, status, totalOrder, orderItems });

    const orderCreatedPresenter =
      OrderTransformers.generateDefaultPresenter(orderCreated);

    console.log({
      message: 'Order created',
      data: orderCreatedPresenter,
    });

    return orderCreatedPresenter;
  }

  private mapOrderItemsValidation(orderItems: CreateOrderRequest['orderItems']) {
    return orderItems.map((orderItem) => {
      return this.orderItemsValidation.validate(orderItem);
    }).flat()[0];
  }
}
