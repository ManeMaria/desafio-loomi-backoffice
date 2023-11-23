import {
  IGetProductByIdRepository,
  IDeleteProductByIdRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductNotFoundException,
} from '@/domains/product/usecases/exceptions';



export interface IDeleteProductByIdUsecase {
  execute(
    id: IDeleteProductByIdUsecase.Params
  ): Promise<IDeleteProductByIdUsecase.Result>;
}

export namespace IDeleteProductByIdUsecase {
  export type Params = string;
  export type Result = void;
}

export class DeleteProductByIdUsecase implements IDeleteProductByIdUsecase {


  constructor(
    private readonly getProductByIdRepository: IGetProductByIdRepository,
    private readonly deleteProductByIdRepository: IDeleteProductByIdRepository,

  ) {

  }

  async execute(
    id: IDeleteProductByIdUsecase.Params,
  ): Promise<IDeleteProductByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const productExists = await this.getProductByIdRepository.get(id);

    if (!productExists) {
      throw new ProductNotFoundException({ id });
    }

    console.log({
      message: 'Product found',
      data: productExists,
    });

    await this.deleteProductByIdRepository.delete({
      id,
      data: {
        enabled: false
      }
    });

    console.log({ message: 'Product deleted', data: { id } });
  }
}
