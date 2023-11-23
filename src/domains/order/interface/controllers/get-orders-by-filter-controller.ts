import {
  GetOrdersByFilterUsecase,
} from '@/domains/order/usecases';
import {
  ICountOrdersByFilterRepository,
  IGetOrdersByFilterRepository,
} from '@/domains/order/usecases/repos';

import {
  OrderDefaultPresenter,
  OrderTransformers,
} from '@/domains/order/interface/presenters';

import {
  OrderByFilter,
  OrderByMode,
  Pagination,
  ValidationException,
} from '@/shared/helpers';


import { Validation } from '@/shared/interface/validation/protocols';

export interface GetOrdersByFilterRequest {
  status?: string;
  clientName?: string;
  enabled?: boolean;
  totalOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
  orderBy: {
    property?: string;
    mode?: OrderByMode;
  };
  take?: number;
  skip?: number;
  count?: boolean;
}

export type GetOrdersByFilterResponse =
  | {
    items: OrderDefaultPresenter[];
    totalItemsListed: number;
    totalItems: number;
  }
  | { totalItems: number };

export class GetOrdersByFilterController {
  private usecase: GetOrdersByFilterUsecase;


  constructor(
    getOrdersByFilterRepository: IGetOrdersByFilterRepository,
    countOrdersByFilterRepository: ICountOrdersByFilterRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetOrdersByFilterUsecase(
      getOrdersByFilterRepository,
      countOrdersByFilterRepository,

    );


  }

  async execute(
    request: GetOrdersByFilterRequest,
  ): Promise<GetOrdersByFilterResponse> {
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
      status,
      clientName,
      enabled,
      createdAt,
      updatedAt,
      count,
    } = request;

    const orderBy = new OrderByFilter(orderByDTO);
    const pagination = new Pagination({ take, skip });

    const { orders, totalOrders } = await this.usecase.execute({
      filters: {
        status,
        clientName,
        enabled,
        createdAt,
        updatedAt,
      },
      orderBy,
      pagination,
      count,
    });

    console.log({
      message: 'Orders found',
      data: { totalOrders, totalItemsListed: orders?.length },
    });

    if (count) {
      return {
        totalItems: totalOrders,
      };
    }

    const ordersDTOs = orders?.map((order) =>
      OrderTransformers.generateDefaultPresenter(order)
    );

    return {
      items: ordersDTOs,
      totalItems: totalOrders,
      totalItemsListed: ordersDTOs?.length,
    };
  }
}
