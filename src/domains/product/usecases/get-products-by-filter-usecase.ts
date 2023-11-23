import {
  IGetProductsByFilterRepository,
  ICountProductsByFilterRepository,
} from '@/domains/product/usecases/repos';
import {
  Product,
} from '@/domains/product/entities';

import { DateFilter, OrderByFilter, Pagination } from '@/shared/helpers';



export type ProductFilters = {
  filters: {
    name?: string;
    description?: string;
    cost?: number;
    quantity?: number;
    enabled?: boolean;
    createdAt?: DateFilter;
    updatedAt?: DateFilter;
  };
  orderBy: OrderByFilter;
  pagination: Pagination;
  count?: boolean;
};

export interface IGetProductsByFilterUsecase {
  execute(
    listParams: IGetProductsByFilterUsecase.Params,
  ): Promise<IGetProductsByFilterUsecase.Result>;
}

export namespace IGetProductsByFilterUsecase {
  export type Params = ProductFilters;
  export type Result = { products?: Array<Product>; totalProducts: number };
}

export class GetProductsByFilterUsecase
  implements IGetProductsByFilterUsecase {


  constructor(
    private readonly getProductsByFilterRepository: IGetProductsByFilterRepository,
    private readonly countProductsByFilterRepository: ICountProductsByFilterRepository,

  ) {

  }

  async execute(
    filterParams: IGetProductsByFilterUsecase.Params,
  ): Promise<IGetProductsByFilterUsecase.Result> {
    console.log({ message: 'Request received', data: filterParams });

    const { count, ...restFilterParams } = filterParams;
    const { filters } = restFilterParams;

    const totalProducts = await this.countProductsByFilterRepository.count(
      filters
    );

    if (count) {
      return {
        totalProducts,
      };
    }

    const products = await this.getProductsByFilterRepository.get(
      restFilterParams,
    );

    console.log({
      message: 'Products found',
      data: { totalProducts },
    });

    return {
      products,
      totalProducts,
    };
  }
}
