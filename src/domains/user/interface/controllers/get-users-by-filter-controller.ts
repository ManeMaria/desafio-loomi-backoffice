import { GetUsersByFilterUsecase } from '@/domains/user/usecases';
import {
  IGetUsersByFilterRepository,
  ICountUsersByFilterRepository,
} from '@/domains/user/usecases/repos';
import {
  UserDefaultPresenter,
  UserTransformers,
} from '@/domains/user/interface/presenters';

import {
  DateFilter,
  OrderByFilter,
  OrderByMode,
  Pagination,
  ValidationException,
} from '@/shared/helpers';

import { Validation } from '@/shared/interface/validation/protocols';

export interface GetUsersByFilterRequest {
  name?: string;
  email?: string;
  type?: string;
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

export type GetUsersByFilterResponse =
  | {
    items: UserDefaultPresenter[];
    totalItemsListed: number;
    totalItems: number;
  }
  | { totalItems: number };

export class GetUsersByFilterController {
  private usecase: GetUsersByFilterUsecase;

  constructor(
    getUsersByFilterRepository: IGetUsersByFilterRepository,
    countUsersByFilterRepository: ICountUsersByFilterRepository,
    private readonly validation: Validation
  ) {
    this.usecase = new GetUsersByFilterUsecase(
      getUsersByFilterRepository,
      countUsersByFilterRepository
    );
  }

  async execute(
    request: GetUsersByFilterRequest
  ): Promise<GetUsersByFilterResponse> {
    console.log({ message: 'Request received', data: request });

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const {
      orderBy: orderByFilter,
      take,
      skip,
      name,
      email,
      type,
      enabled,
      createdAt,
      updatedAt,
      count,
    } = request;

    const filters = {
      name,
      email,
      type,
      enabled,
      createdAt,
      updatedAt,
    };

    const orderBy = new OrderByFilter(orderByFilter);
    const pagination = new Pagination({ take, skip });

    const { users, totalUsers } = await this.usecase.execute({
      filters,
      orderBy,
      pagination,
      count,
    });

    console.log({
      message: 'Users found',
      data: { totalUsers, totalItemsListed: users?.length },
    });

    if (count) {
      return {
        totalItems: totalUsers,
      };
    }

    const userPresenters =
      users?.map(UserTransformers.generateDefaultTransformer) ?? [];

    return {
      items: userPresenters,
      totalItems: totalUsers,
      totalItemsListed: users?.length,
    };
  }
}
