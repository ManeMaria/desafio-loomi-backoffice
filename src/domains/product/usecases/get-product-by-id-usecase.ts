import { IGetProductByIdRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';



export interface IGetProductByIdUsecase {
  execute(
    id: IGetProductByIdUsecase.Params
  ): Promise<IGetProductByIdUsecase.Result>;
}

export namespace IGetProductByIdUsecase {
  export type Params = string;
  export type Result = Product | null;
}

export class GetProductByIdUsecase implements IGetProductByIdUsecase {


  constructor(
    private readonly getProductByIdRepository: IGetProductByIdRepository,

  ) {

  }

  async execute(
    id: IGetProductByIdUsecase.Params,
  ): Promise<IGetProductByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const productExists = await this.getProductByIdRepository.get(id);

    if (!productExists) return null;

    console.log({
      message: 'Product found',
      data: productExists,
    });

    return productExists;
  }
}
