import {
  UpdateProductByIdUsecase,
} from '@/domains/product/usecases';
import {
  IGetProductByIdRepository,
  IUpdateProductRepository,
  IGetProductByNameRepository,
} from '@/domains/product/usecases/repos';

import {
  ProductDefaultPresenter,
  ProductTransformers,
} from '@/domains/product/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface UpdateProductByIdRequest {
  id: string;
  paramsToUpdate: {
    name?: string;
    description?: string;
    cost?: number;
    quantity?: number;
  };
}

export type UpdateProductByIdResponse = ProductDefaultPresenter;

export class UpdateProductByIdController {
  private usecase: UpdateProductByIdUsecase;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    getProductByNameRepository: IGetProductByNameRepository,
    updateProductRepository: IUpdateProductRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new UpdateProductByIdUsecase(
      getProductByIdRepository,
      getProductByNameRepository,
      updateProductRepository,

    );


  }

  async execute(
    request: UpdateProductByIdRequest,
  ): Promise<UpdateProductByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id, paramsToUpdate } = request;

    const { name, description, cost, quantity } = paramsToUpdate;

    const hasErrors = this.validation.validate({
      id,
    });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const productUpdated = await this.usecase.execute({
      id,
      paramsToUpdate: {
        name,
        description,
        cost,
        quantity,
      },
    });

    const productUpdatedPresenter =
      ProductTransformers.generateDefaultPresenter(productUpdated);

    console.log({
      message: 'Product updated',
      data: productUpdatedPresenter,
    });

    return productUpdatedPresenter;
  }
}
