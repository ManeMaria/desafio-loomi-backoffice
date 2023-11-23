import { Order } from '@/domains/order/entities';

export interface ISaveOrderRepository {
  save(
    orderParams: ISaveOrderRepository.Params,
  ): Promise<ISaveOrderRepository.Result>;
}

export namespace ISaveOrderRepository {
  export type Params = {
    id: string;
    status: string;
    totalOrder: number;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // association
    clientId: string
  }
  export type Result = Order;
}
