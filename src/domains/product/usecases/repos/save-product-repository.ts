import { Product } from '@/domains/product/entities';

export interface ISaveProductRepository {
  save(
    productParams: ISaveProductRepository.Params,
  ): Promise<ISaveProductRepository.Result>;
}

export namespace ISaveProductRepository {
  export type Params = Product;
  export type Result = Product;
}
