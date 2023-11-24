import {
  IGetOrderItemsByOrderIdRepository,
  IDeleteOrderItemsByOrderIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderItemNotFoundException
} from '@/domains/order/usecases/exceptions';



export interface IDeleteOrderItemsByOrderIdUsecase {
  execute(
    id: IDeleteOrderItemsByOrderIdUsecase.Params
  ): Promise<IDeleteOrderItemsByOrderIdUsecase.Result>;
}

export namespace IDeleteOrderItemsByOrderIdUsecase {
  export type Params = string;
  export type Result = void;
}

export class DeleteOrderItemsByIdUsecase implements IDeleteOrderItemsByOrderIdUsecase {
  constructor(
    private readonly getOrderItemsByIdRepository: IGetOrderItemsByOrderIdRepository,
    private readonly deleteOrderItemsByIdRepository: IDeleteOrderItemsByOrderIdRepository,

  ) {

  }

  async execute(
    id: IDeleteOrderItemsByOrderIdUsecase.Params,
  ): Promise<IDeleteOrderItemsByOrderIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const orderItemsExists = await this.getOrderItemsByIdRepository.get(id);

    if (!orderItemsExists) {
      throw new OrderItemNotFoundException({ id });
    }

    console.log({
      message: 'OrderItems found',
      data: orderItemsExists,
    });

    await this.deleteOrderItemsByIdRepository.delete(id);

    console.log({ message: 'OrderItems deleted', data: { id } });
  }
}
