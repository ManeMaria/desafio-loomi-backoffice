import {
  IUpdateProductRepository,
  IGetProductByIdRepository,
  IGetProductByNameRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductNotFoundException,
  ProductAlreadyExistsException,
} from '@/domains/product/usecases/exceptions';
import {
  UpdateProductByIdController,
} from '@/domains/product/interface/controllers';

import {
  ok,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';
import {
  HttpResponse,
  HttpController,
} from '@/shared/interface/http/protocols';

import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface HttpUpdateProductByIdRequest {
  id: string;
  name?: string;
  description?: string;
  cost?: number;
  quantity?: number;
}

export class HttpUpdateProductByIdController implements HttpController {
  private controller: UpdateProductByIdController;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    getProductByNameRepository: IGetProductByNameRepository,
    updateProductRepository: IUpdateProductRepository,
    validation: Validation,

  ) {
    this.controller = new UpdateProductByIdController(
      getProductByIdRepository,
      getProductByNameRepository,
      updateProductRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpUpdateProductByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id, name, description, cost, quantity } = httpRequest;

    const request = {
      id,
      paramsToUpdate: {
        name,
        description,
        cost,
        quantity,
      },
    };

    try {
      const productUpdated = await this.controller.execute(request);

      console.log({
        message: 'Product updated',
        data: productUpdated,
      });

      return ok(productUpdated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ProductAlreadyExistsException) {
        return badRequest(error);
      }

      if (error instanceof ProductNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
