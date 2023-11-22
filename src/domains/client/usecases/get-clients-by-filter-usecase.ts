import {
  IGetClientsByFilterRepository,
  ICountClientsByFilterRepository,
} from '@/domains/client/usecases/repos';
import {
  Client,
} from '@/domains/client/entities';

import { DateFilter, OrderByFilter, Pagination } from '@/shared/helpers';



export type ClientFilters = {
  filters: {
    name?: string;
    contact?: string;
    address?: string;
    enabled?: boolean;
    createdAt?: DateFilter;
    updatedAt?: DateFilter;
  };
  orderBy: OrderByFilter;
  pagination: Pagination;
  count?: boolean;
};

export interface IGetClientsByFilterUsecase {
  execute(
    listParams: IGetClientsByFilterUsecase.Params,
  ): Promise<IGetClientsByFilterUsecase.Result>;
}

export namespace IGetClientsByFilterUsecase {
  export type Params = ClientFilters;
  export type Result = { clients?: Array<Client>; totalClients: number };
}

export class GetClientsByFilterUsecase
  implements IGetClientsByFilterUsecase {


  constructor(
    private readonly getClientsByFilterRepository: IGetClientsByFilterRepository,
    private readonly countClientsByFilterRepository: ICountClientsByFilterRepository,

  ) {

  }

  async execute(
    filterParams: IGetClientsByFilterUsecase.Params,
  ): Promise<IGetClientsByFilterUsecase.Result> {
    console.log({ message: 'Request received', data: filterParams });

    const { count, ...restFilterParams } = filterParams;
    const { filters } = restFilterParams;

    const totalClients = await this.countClientsByFilterRepository.count(
      filters
    );

    if (count) {
      return {
        totalClients,
      };
    }

    const clients = await this.getClientsByFilterRepository.get(
      restFilterParams,
    );

    console.log({
      message: 'Clients found',
      data: { totalClients },
    });

    return {
      clients,
      totalClients,
    };
  }
}
