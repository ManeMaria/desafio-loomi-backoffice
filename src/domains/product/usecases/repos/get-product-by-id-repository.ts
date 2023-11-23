import { Product } from '@/domains/product/entities';

export interface IGetProductByIdRepository {
  get(
    id: IGetProductByIdRepository.Params,
  ): Promise<IGetProductByIdRepository.Result>;
}

export namespace IGetProductByIdRepository {
  export type Params = string;
  export type Result = Product | null;
}
