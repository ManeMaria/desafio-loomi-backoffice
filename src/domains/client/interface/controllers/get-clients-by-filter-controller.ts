import {
  GetClientsByFilterUsecase,
} from '@/domains/client/usecases';
import {
  ICountClientsByFilterRepository,
  IGetClientsByFilterRepository,
} from '@/domains/client/usecases/repos';

import {
  ClientDefaultPresenter,
  ClientTransformers,
} from '@/domains/client/interface/presenters';

import {
  OrderByFilter,
  OrderByMode,
  DateFilter,
  Pagination,
  ValidationException,
} from '@/shared/helpers';


import { Validation } from '@/shared/interface/validation/protocols';

export interface GetClientsByFilterRequest {
  name?: string;
  contact?: string;
  address?: string;
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

export type GetClientsByFilterResponse =
  | {
    items: ClientDefaultPresenter[];
    totalItemsListed: number;
    totalItems: number;
  }
  | { totalItems: number };

export class GetClientsByFilterController {
  private usecase: GetClientsByFilterUsecase;


  constructor(
    getClientsByFilterRepository: IGetClientsByFilterRepository,
    countClientsByFilterRepository: ICountClientsByFilterRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetClientsByFilterUsecase(
      getClientsByFilterRepository,
      countClientsByFilterRepository,

    );


  }

  async execute(
    request: GetClientsByFilterRequest,
  ): Promise<GetClientsByFilterResponse> {
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
      address,
      contact,
      enabled,
      createdAt,
      updatedAt,
      count,
    } = request;


    const orderBy = new OrderByFilter(orderByDTO);
    const pagination = new Pagination({ take, skip });

    const { clients, totalClients } = await this.usecase.execute({
      filters: {
        name,
        address,
        contact,
        enabled,
        createdAt,
        updatedAt,
      },
      orderBy,
      pagination,
      count,
    });

    console.log({
      message: 'Clients found',
      data: { totalClients, totalItemsListed: clients?.length },
    });

    if (count) {
      return {
        totalItems: totalClients,
      };
    }

    const clientsDTOs = clients?.map((client) =>
      ClientTransformers.generateDefaultPresenter(client)
    );

    return {
      items: clientsDTOs,
      totalItems: totalClients,
      totalItemsListed: clientsDTOs?.length,
    };
  }
}
