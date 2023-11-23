import { ProductFilters } from '@/domains/product/usecases';
import { Product } from '@/domains/product/entities';

export interface IGetProductsByFilterRepository {
  get(
    params: IGetProductsByFilterRepository.Params,
  ): Promise<IGetProductsByFilterRepository.Result>;
}

export namespace IGetProductsByFilterRepository {
  export type Params = ProductFilters;
  export type Result = Array<Product>;
}
