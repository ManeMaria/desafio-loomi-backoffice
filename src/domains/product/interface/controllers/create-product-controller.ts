import {
  CreateProductUsecase,
} from '@/domains/product/usecases';
import {
  ISaveProductRepository,
  IGetProductByNameRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductDefaultPresenter,
  ProductTransformers,
} from '@/domains/product/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';

export interface CreateProductRequest {
  name: string;
  description: string;
  cost: number;
  quantity: number;
  enabled: boolean;
}

export type CreateProductResponse = ProductDefaultPresenter;

export class CreateProductController {
  private usecase: CreateProductUsecase;


  constructor(
    getProductByNameRepository: IGetProductByNameRepository,
    saveProductRepository: ISaveProductRepository,
    uuidGenerator: IUuidGenerator,
    private readonly validation: Validation,

  ) {
    this.usecase = new CreateProductUsecase(
      getProductByNameRepository,
      saveProductRepository,
      uuidGenerator,
    );


  }

  async execute(
    request: CreateProductRequest
  ): Promise<CreateProductResponse> {
    console.log({ message: 'Request received', data: request });

    const { name, cost, description, enabled, quantity } = request;

    const hasError = this.validation.validate({
      name,
      cost,
      description,
      enabled,
      quantity
    });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const productCreated = await this.usecase.execute({ name, cost, description, enabled, quantity });

    const productCreatedPresenter =
      ProductTransformers.generateDefaultPresenter(productCreated);

    console.log({
      message: 'Product created',
      data: productCreatedPresenter,
    });

    return productCreatedPresenter;
  }
}
