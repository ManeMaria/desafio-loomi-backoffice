import {
  CreateOrderUsecase,
} from '@/domains/order/usecases';
import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderDefaultPresenter,
  OrderTransformers,
} from '@/domains/order/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';

export interface CreateOrderRequest {
  status: string;
  totalOrder: number;
  clientId: string;
}

export type CreateOrderResponse = OrderDefaultPresenter;

export class CreateOrderController {
  private usecase: CreateOrderUsecase;


  constructor(

    saveOrderRepository: ISaveOrderRepository,
    uuidGenerator: IUuidGenerator,
    private readonly validation: Validation,

  ) {
    this.usecase = new CreateOrderUsecase(
      saveOrderRepository,
      uuidGenerator,
    );


  }

  async execute(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    console.log({ message: 'Request received', data: request });

    const { clientId, status, totalOrder } = request;

    const hasError = this.validation.validate({
      clientId, status, totalOrder
    });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const orderCreated = await this.usecase.execute({ clientId, status, totalOrder });

    const orderCreatedPresenter =
      OrderTransformers.generateDefaultPresenter(orderCreated);

    console.log({
      message: 'Order created',
      data: orderCreatedPresenter,
    });

    return orderCreatedPresenter;
  }
}
