import { OrderItems } from '@/domains/order/entities';

export interface IGetOrderItemsByOrderIdRepository {
  get(
    id: IGetOrderItemsByOrderIdRepository.Params,
  ): Promise<IGetOrderItemsByOrderIdRepository.Result>;
}

export namespace IGetOrderItemsByOrderIdRepository {
  export type Params = string;
  export type Result = OrderItems[] | null;
}
