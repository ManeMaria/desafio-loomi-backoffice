import { ProductFilters } from '@/domains/product/usecases';

export interface ICountProductsByFilterRepository {
  count(
    filters: ICountProductsByFilterRepository.Params,
  ): Promise<ICountProductsByFilterRepository.Result>;
}

export namespace ICountProductsByFilterRepository {
  export type Params = ProductFilters['filters'];
  export type Result = number;
}
