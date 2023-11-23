import {
  DeleteProductByIdUsecase,
} from '@/domains/product/usecases';
import {
  IGetProductByIdRepository,
  IDeleteProductByIdRepository,
} from '@/domains/product/usecases/repos';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface DeleteProductByIdRequest {
  id: string;
}

export type DeleteProductByIdResponse = void;

export class DeleteProductByIdController {
  private usecase: DeleteProductByIdUsecase;


  constructor(
    getProductByIdRepository: IGetProductByIdRepository,
    deleteProductByIdRepository: IDeleteProductByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new DeleteProductByIdUsecase(
      getProductByIdRepository,
      deleteProductByIdRepository,

    );


  }

  async execute(
    request: DeleteProductByIdRequest,
  ): Promise<DeleteProductByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasError = this.validation.validate({ id });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    await this.usecase.execute(id);

    console.log({ message: 'Product deleted', data: { id } });
  }
}
