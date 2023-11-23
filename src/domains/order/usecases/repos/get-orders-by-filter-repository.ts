import { OrderFilters } from '@/domains/order/usecases';
import { Order } from '@/domains/order/entities';

export interface IGetOrdersByFilterRepository {
  get(
    params: IGetOrdersByFilterRepository.Params,
  ): Promise<IGetOrdersByFilterRepository.Result>;
}

export namespace IGetOrdersByFilterRepository {
  export type Params = OrderFilters;
  export type Result = Array<Order>;
}
