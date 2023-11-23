import {
  GetProductsByFilterUsecase,
} from '@/domains/product/usecases';
import {
  ICountProductsByFilterRepository,
  IGetProductsByFilterRepository,
} from '@/domains/product/usecases/repos';

import {
  ProductDefaultPresenter,
  ProductTransformers,
} from '@/domains/product/interface/presenters';

import {
  OrderByFilter,
  OrderByMode,
  DateFilter,
  Pagination,
  ValidationException,
} from '@/shared/helpers';


import { Validation } from '@/shared/interface/validation/protocols';

export interface GetProductsByFilterRequest {
  name?: string;
  description?: string;
  cost?: number;
  quantity?: number;
  enabled?: boolean;
  createdAt?: DateFilter;
  updatedAt?: DateFilter;
  orderBy: {
    property?: string;
    mode?: OrderByMode;
  };
  take?: number;
  skip?: number;
  count?: boolean;
}

export type GetProductsByFilterResponse =
  | {
    items: ProductDefaultPresenter[];
    totalItemsListed: number;
    totalItems: number;
  }
  | { totalItems: number };

export class GetProductsByFilterController {
  private usecase: GetProductsByFilterUsecase;


  constructor(
    getProductsByFilterRepository: IGetProductsByFilterRepository,
    countProductsByFilterRepository: ICountProductsByFilterRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetProductsByFilterUsecase(
      getProductsByFilterRepository,
      countProductsByFilterRepository,

    );


  }

  async execute(
    request: GetProductsByFilterRequest,
  ): Promise<GetProductsByFilterResponse> {
    console.log({ message: 'Request received', data: request });

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const {
      orderBy: orderByDTO,
      take,
      skip,
      name,
      cost,
      quantity,
      description,
      enabled,
      createdAt,
      updatedAt,
      count,
    } = request;

    const orderBy = new OrderByFilter(orderByDTO);
    const pagination = new Pagination({ take, skip });

    const { products, totalProducts } = await this.usecase.execute({
      filters: {
        name,
        cost,
        quantity,
        description,
        enabled,
        createdAt,
        updatedAt,
      },
      orderBy,
      pagination,
      count,
    });

    console.log({
      message: 'Products found',
      data: { totalProducts, totalItemsListed: products?.length },
    });

    if (count) {
      return {
        totalItems: totalProducts,
      };
    }

    const productsDTOs = products?.map((product) =>
      ProductTransformers.generateDefaultPresenter(product)
    );

    return {
      items: productsDTOs,
      totalItems: totalProducts,
      totalItemsListed: productsDTOs?.length,
    };
  }
}
