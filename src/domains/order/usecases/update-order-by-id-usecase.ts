import {
  IGetOrderByIdRepository,
  IUpdateOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderNotFoundException,
} from '@/domains/order/usecases/exceptions';
import {
  Order,
} from '@/domains/order/entities';



export interface IUpdateOrderByIdUsecase {
  execute(
    updateParams: IUpdateOrderByIdUsecase.Params,
  ): Promise<IUpdateOrderByIdUsecase.Result>;
}

export namespace IUpdateOrderByIdUsecase {
  export type Params = {
    id: string;
    paramsToUpdate: {
      status?: string;
      totalOrder?: number;
      createdAt?: Date;
    };
  };
  export type Result = Order;
}

export class UpdateOrderByIdUsecase implements IUpdateOrderByIdUsecase {

  constructor(
    private readonly getOrderByIdRepository: IGetOrderByIdRepository,
    private readonly updateOrderRepository: IUpdateOrderRepository,

  ) {

  }

  async execute(
    updateParams: IUpdateOrderByIdUsecase.Params,
  ): Promise<IUpdateOrderByIdUsecase.Result> {
    console.log({ message: 'Request received', data: updateParams });

    const { id, paramsToUpdate } = updateParams;

    const orderExists = await this.getOrderByIdRepository.get(id);

    if (!orderExists) {
      console.log({
        message: 'Order found',
        data: updateParams,
      });

      throw new OrderNotFoundException({ id });
    }

    console.log({
      message: 'Order found',
      data: orderExists,
    });

    const orderToUpdate = new Order({
      ...orderExists,
      ...paramsToUpdate,
    });


    const orderUpdated = await this.updateOrderRepository.update(
      orderToUpdate,
    );

    console.log({
      message: 'Order updated',
      data: orderUpdated,
    });

    return orderUpdated;
  }
}
