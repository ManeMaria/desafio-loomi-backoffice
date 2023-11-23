import {
  IGetOrdersByFilterRepository,
  ICountOrdersByFilterRepository,
} from '@/domains/order/usecases/repos';
import {
  Order,
} from '@/domains/order/entities';

import { OrderByFilter, Pagination } from '@/shared/helpers';



export type OrderFilters = {
  filters: {
    clientName?: string;
    status?: string;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  orderBy: OrderByFilter;
  pagination: Pagination;
  count?: boolean;
};

export interface IGetOrdersByFilterUsecase {
  execute(
    listParams: IGetOrdersByFilterUsecase.Params,
  ): Promise<IGetOrdersByFilterUsecase.Result>;
}

export namespace IGetOrdersByFilterUsecase {
  export type Params = OrderFilters;
  export type Result = { orders?: Array<Order>; totalOrders: number };
}

export class GetOrdersByFilterUsecase
  implements IGetOrdersByFilterUsecase {


  constructor(
    private readonly getOrdersByFilterRepository: IGetOrdersByFilterRepository,
    private readonly countOrdersByFilterRepository: ICountOrdersByFilterRepository,

  ) {

  }

  async execute(
    filterParams: IGetOrdersByFilterUsecase.Params,
  ): Promise<IGetOrdersByFilterUsecase.Result> {
    console.log({ message: 'Request received', data: filterParams });

    const { count, ...restFilterParams } = filterParams;
    const { filters } = restFilterParams;

    const totalOrders = await this.countOrdersByFilterRepository.count(
      filters
    );

    if (count) {
      return {
        totalOrders,
      };
    }

    const orders = await this.getOrdersByFilterRepository.get(
      restFilterParams,
    );

    console.log({
      message: 'Orders found',
      data: { totalOrders },
    });

    return {
      orders,
      totalOrders,
    };
  }
}
