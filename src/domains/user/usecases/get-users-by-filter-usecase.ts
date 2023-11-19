import { User } from '@/domains/user/entities';
import {
  IGetUsersByFilterRepository,
  ICountUsersByFilterRepository,
} from '@/domains/user/usecases/repos';

import { DateFilter, OrderByFilter, Pagination } from '@/shared/helpers';

export type UserFilters = {
  filters: {
    name?: string;
    email?: string;
    isAdmin?: boolean;
    enabled?: boolean;
    createdAt?: DateFilter;
    updatedAt?: DateFilter;
  };
  orderBy: OrderByFilter;
  pagination: Pagination;
  count?: boolean;
};

export interface IGetUsersByFilterUsecase {
  execute(
    listParams: IGetUsersByFilterUsecase.Params
  ): Promise<IGetUsersByFilterUsecase.Result>;
}

export namespace IGetUsersByFilterUsecase {
  export type Params = UserFilters;
  export type Result = { users?: User[]; totalUsers: number };
}

export class GetUsersByFilterUsecase implements IGetUsersByFilterUsecase {
  constructor(
    private readonly getUsersByFilterRepository: IGetUsersByFilterRepository,
    private readonly countUsersByFilterRepository: ICountUsersByFilterRepository
  ) {}

  async execute(
    filterParams: IGetUsersByFilterUsecase.Params
  ): Promise<IGetUsersByFilterUsecase.Result> {
    console.log({ message: 'Request received', data: filterParams });

    const { count, ...restFilterParams } = filterParams;
    const { filters } = restFilterParams;

    const totalUsers = await this.countUsersByFilterRepository.count(filters);

    if (count) {
      return {
        totalUsers,
      };
    }

    const users = await this.getUsersByFilterRepository.get(restFilterParams);

    console.log({ message: 'Users found', data: { totalUsers } });

    return {
      users,
      totalUsers,
    };
  }
}
