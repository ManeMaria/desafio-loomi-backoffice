import {
  UpdateOrderByIdUsecase,
} from '@/domains/order/usecases';
import {
  IGetOrderByIdRepository,
  IUpdateOrderRepository,
} from '@/domains/order/usecases/repos';

import {
  OrderDefaultPresenter,
  OrderTransformers,
} from '@/domains/order/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface UpdateOrderByIdRequest {
  id: string;
  paramsToUpdate: {
    status?: string;
    totalOrder?: number;
    createdAt?: Date;
  };
}

export type UpdateOrderByIdResponse = OrderDefaultPresenter;

export class UpdateOrderByIdController {
  private usecase: UpdateOrderByIdUsecase;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    updateOrderRepository: IUpdateOrderRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new UpdateOrderByIdUsecase(
      getOrderByIdRepository,
      updateOrderRepository,

    );


  }

  async execute(
    request: UpdateOrderByIdRequest,
  ): Promise<UpdateOrderByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id, paramsToUpdate } = request;

    const { createdAt, status, totalOrder } = paramsToUpdate;

    const hasErrors = this.validation.validate({
      id,
      createdAt,
      status,
      totalOrder
    });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const orderUpdated = await this.usecase.execute({
      id,
      paramsToUpdate: {
        createdAt,
        status,
        totalOrder
      },
    });

    const orderUpdatedPresenter =
      OrderTransformers.generateDefaultPresenter(orderUpdated);

    console.log({
      message: 'Order updated',
      data: orderUpdatedPresenter,
    });

    return orderUpdatedPresenter;
  }
}
