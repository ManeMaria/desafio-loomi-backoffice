import { OrderFilters } from '@/domains/order/usecases';

export interface ICountOrdersByFilterRepository {
  count(
    filters: ICountOrdersByFilterRepository.Params,
  ): Promise<ICountOrdersByFilterRepository.Result>;
}

export namespace ICountOrdersByFilterRepository {
  export type Params = OrderFilters['filters'];
  export type Result = number;
}
