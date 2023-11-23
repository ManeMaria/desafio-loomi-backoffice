import {
  IDeleteProductByIdRepository,
  IGetProductByIdRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductNotFoundException,
} from '@/domains/product/usecases/exceptions';
import {
  DeleteProductByIdController,
} from '@/domains/product/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import {
  noContent,
  notFound,
  badRequest,
  serverError,
} from '@/shared/interface/http/helpers';

import { Validation } from '@/shared/interface/validation/protocols';
import { ValidationException } from '@/shared/helpers';

export interface HttpDeleteProductByIdRequest {
  id: string;
}

export class HttpDeleteProductByIdController implements HttpController {
  private controller: DeleteProductByIdController;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    deleteProductByIdRepository: IDeleteProductByIdRepository,
    validation: Validation,

  ) {
    this.controller = new DeleteProductByIdController(
      getProductByIdRepository,
      deleteProductByIdRepository,
      validation,

    );


  }

  async handle(
    httpRequest: HttpDeleteProductByIdRequest
  ): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { id } = httpRequest;

    try {
      await this.controller.execute({ id });

      console.log({
        message: 'Product deleted',
        data: { id },
      });

      return noContent();
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ProductNotFoundException) {
        return notFound(error);
      }

      return serverError(error as Error);
    }
  }
}
