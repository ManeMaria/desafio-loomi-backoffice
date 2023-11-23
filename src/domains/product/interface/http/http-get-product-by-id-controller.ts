import {
  IGetProductByIdRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductNotFoundException,
} from '@/domains/product/usecases/exceptions';
import {
  GetProductByIdController,
} from '@/domains/product/interface/controllers';

import {
  ok,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';
import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpGetProductByIdRequest {
  id: string;
}

export class HttpGetProductByIdController implements HttpController {
  private controller: GetProductByIdController;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    validation: Validation,

  ) {
    this.controller = new GetProductByIdController(
      getProductByIdRepository,
      validation,

    );


  }

  async handle(httpRequest: HttpGetProductByIdRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      const product = await this.controller.execute({ id });

      console.log({
        message: 'Product found',
        data: product,
      });

      if (!product) {
        return notFound(new ProductNotFoundException({ id }));
      }

      return ok(product);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
