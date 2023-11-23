import { Product } from '@/domains/product/entities';

export interface IUpdateProductRepository {
  update(
    productToUpdate: IUpdateProductRepository.Params,
  ): Promise<IUpdateProductRepository.Result>;
}

export namespace IUpdateProductRepository {
  export type Params = Partial<Product>;
  export type Result = Product;
}
