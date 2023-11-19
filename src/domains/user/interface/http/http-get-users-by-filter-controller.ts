import {
  IGetUsersByFilterRepository,
  ICountUsersByFilterRepository,
} from '@/domains/user/usecases/repos';
import { GetUsersByFilterController } from '@/domains/user/interface/controllers';

import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';

import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, ok, serverError } from '@/shared/interface/http/helpers';
import { DateFilter, OrderByMode, ValidationException } from '@/shared/helpers';

export type HttpGetUsersByFilterRequest = {
  name?: string;
  email?: string;
  type?: string;
  enabled?: boolean;
  created_at?: DateFilter;
  updated_at?: DateFilter;
  order_by: {
    property?: string;
    mode?: OrderByMode;
  };
  take?: number;
  skip?: number;
  count?: boolean;
};

export class HttpGetUsersByFilterController implements HttpController {
  private controller: GetUsersByFilterController;

  constructor(
    getUsersByFilterRepository: IGetUsersByFilterRepository,
    countUsersByFilterRepository: ICountUsersByFilterRepository,
    validation: Validation
  ) {
    this.controller = new GetUsersByFilterController(
      getUsersByFilterRepository,
      countUsersByFilterRepository,
      validation
    );
  }

  async handle(
    httpRequest: HttpGetUsersByFilterRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const {
      name,
      email,
      type,
      enabled,
      created_at: createdAt,
      updated_at: updatedAt,
      order_by: orderBy,
      take,
      skip,
      count,
    } = httpRequest;

    try {
      const users = await this.controller.execute({
        name,
        email,
        type,
        enabled,
        createdAt,
        updatedAt,
        orderBy,
        take,
        skip,
        count,
      });

      console.log({ message: 'Users found' });

      return ok(users);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
