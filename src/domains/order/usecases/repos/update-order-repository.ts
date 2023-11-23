import { Order } from '@/domains/order/entities';

export interface IUpdateOrderRepository {
  update(
    orderToUpdate: IUpdateOrderRepository.Params,
  ): Promise<IUpdateOrderRepository.Result>;
}

export namespace IUpdateOrderRepository {
  export type Params = Order;
  export type Result = Order;
}
