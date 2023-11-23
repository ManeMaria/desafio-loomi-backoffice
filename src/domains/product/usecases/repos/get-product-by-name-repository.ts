import { Product } from '@/domains/product/entities';

export interface IGetProductByNameRepository {
  get(
    name: IGetProductByNameRepository.Params,
  ): Promise<IGetProductByNameRepository.Result>;
}

export namespace IGetProductByNameRepository {
  export type Params = string;
  export type Result = Product | null;
}
