import { Order } from '@/domains/order/entities';

export interface IGetOrderByIdRepository {
  get(
    id: IGetOrderByIdRepository.Params,
  ): Promise<IGetOrderByIdRepository.Result>;
}

export namespace IGetOrderByIdRepository {
  export type Params = string;
  export type Result = Order | null;
}
