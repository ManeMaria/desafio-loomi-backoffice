import {
  GetOrderItemsByOrderIdUsecase, IGetOrderItemsByOrderIdUsecase,
} from '@/domains/order/usecases';
import {
  IGetOrderItemsByOrderIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderItemDefaultPresenter,
  OrderItemTransformers,
} from '@/domains/order/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetOrderItemsByOrderIdRequest {
  id: string;
}

export type GetOrderItemsByOrderIdResponse = { orderItems: OrderItemDefaultPresenter[] } | null;

export class GetOrderItemsByOrderIdController {
  private usecase: GetOrderItemsByOrderIdUsecase;


  constructor(
    getOrderItemsByOrderIdRepository: IGetOrderItemsByOrderIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetOrderItemsByOrderIdUsecase(
      getOrderItemsByOrderIdRepository,

    );


  }

  async execute(
    request: GetOrderItemsByOrderIdRequest
  ): Promise<GetOrderItemsByOrderIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const orderItems = await this.usecase.execute(id);

    console.log({
      message: 'OrderItems found',
      data: orderItems,
    });

    if (!orderItems) {
      return null;
    }

    const orderItemsDefaultPresenter = this.mapOrderItemsToOrderItemsDefaultPresenter(orderItems);

    return { orderItems: orderItemsDefaultPresenter };
  }

  private mapOrderItemsToOrderItemsDefaultPresenter(orderItems: IGetOrderItemsByOrderIdUsecase.Result) {
    return orderItems?.map(orderItem => OrderItemTransformers.generateDefaultPresenter(orderItem)) ?? [];

  }



}
