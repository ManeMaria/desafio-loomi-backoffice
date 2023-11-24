import { OrderItems } from '@/domains/order/entities';

export interface ISaveOrderItemsRepository {
  save(
    orderItemsParams: ISaveOrderItemsRepository.Params,
  ): Promise<ISaveOrderItemsRepository.Result>;
}

export namespace ISaveOrderItemsRepository {
  export type Params = OrderItems[];
  export type Result = OrderItems[];
}
