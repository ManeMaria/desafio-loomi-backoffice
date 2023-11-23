import {
  ISaveProductRepository,
  IGetProductByNameRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductAlreadyExistsException,
} from '@/domains/product/usecases/exceptions';
import {
  CreateProductController,
} from '@/domains/product/interface/controllers';

import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, created, serverError } from '@/shared/interface/http/helpers';
import { IUuidGenerator } from '@/shared/protocols';

export interface HttpCreateProductRequest {
  name: string;
  description: string;
  cost: number;
  quantity: number;
  enabled: boolean;
}

export class HttpCreateProductController implements HttpController {
  private controller: CreateProductController;


  constructor(
    getProductByNameRepository: IGetProductByNameRepository,
    saveProductRepository: ISaveProductRepository,
    uuidGenerator: IUuidGenerator,
    validation: Validation,

  ) {
    this.controller = new CreateProductController(
      getProductByNameRepository,
      saveProductRepository,
      uuidGenerator,
      validation,

    );


  }

  async handle(httpRequest: HttpCreateProductRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });

    const { name, cost, description, enabled, quantity } = httpRequest;

    try {
      const productCreated = await this.controller.execute({
        name, cost, description, enabled, quantity
      });

      console.log({
        message: 'Product created',
        data: productCreated,
      });

      return created(productCreated);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      if (error instanceof ProductAlreadyExistsException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
