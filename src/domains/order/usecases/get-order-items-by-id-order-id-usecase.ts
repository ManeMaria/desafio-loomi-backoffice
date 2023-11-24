import { IGetOrderItemsByOrderIdRepository } from '@/domains/order/usecases/repos';
import { OrderItems } from '@/domains/order/entities';



export interface IGetOrderItemsByOrderIdUsecase {
  execute(
    id: IGetOrderItemsByOrderIdUsecase.Params
  ): Promise<IGetOrderItemsByOrderIdUsecase.Result>;
}

export namespace IGetOrderItemsByOrderIdUsecase {
  export type Params = string;
  export type Result = OrderItems[] | null;
}

export class GetOrderItemsByOrderIdUsecase implements IGetOrderItemsByOrderIdUsecase {


  constructor(
    private readonly getOrderItemsByIdRepository: IGetOrderItemsByOrderIdRepository,

  ) {

  }

  async execute(
    orderId: IGetOrderItemsByOrderIdUsecase.Params,
  ): Promise<IGetOrderItemsByOrderIdUsecase.Result> {
    console.log({ message: 'Request received', data: { orderId } });

    const orderItemsExists = await this.getOrderItemsByIdRepository.get(orderId);

    if (!orderItemsExists) return null;

    console.log({
      message: 'OrderItems found',
      data: orderItemsExists,
    });

    return orderItemsExists;
  }
}
