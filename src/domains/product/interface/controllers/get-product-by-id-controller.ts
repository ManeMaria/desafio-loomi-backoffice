import {
  GetProductByIdUsecase,
} from '@/domains/product/usecases';
import {
  IGetProductByIdRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductDefaultPresenter,
  ProductTransformers,
} from '@/domains/product/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetProductByIdRequest {
  id: string;
}

export type GetProductByIdResponse = { product: ProductDefaultPresenter } | null;

export class GetProductByIdController {
  private usecase: GetProductByIdUsecase;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetProductByIdUsecase(
      getProductByIdRepository,

    );


  }

  async execute(
    request: GetProductByIdRequest
  ): Promise<GetProductByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const product = await this.usecase.execute(id);

    console.log({
      message: 'Product found',
      data: product,
    });

    if (!product) {
      return null;
    }

    const productDefaultPresenter =
      ProductTransformers.generateDefaultPresenter(product);

    return { product: productDefaultPresenter };
  }
}
