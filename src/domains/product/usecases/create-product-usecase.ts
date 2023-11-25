import {
  Product,
} from '@/domains/product/entities';
import {
  IGetProductByNameRepository,
  ISaveProductRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductAlreadyExistsException,
} from '@/domains/product/usecases/exceptions';

import { IUuidGenerator } from '@/shared/protocols';

export interface ICreateProductUsecase {
  execute(
    params: ICreateProductUsecase.Params,
  ): Promise<ICreateProductUsecase.Response>;
}

export namespace ICreateProductUsecase {
  export type Params = {
    name: string;
    description: string;
    cost: number;
    quantity: number;
    enabled: boolean;
  };

  export type Response = Product;
}

export class CreateProductUsecase implements ICreateProductUsecase {

  constructor(
    private readonly getProductByNameRepository: IGetProductByNameRepository,
    private readonly saveProductRepository: ISaveProductRepository,
    private readonly uuidGenerator: IUuidGenerator,

  ) { }

  async execute(
    params: ICreateProductUsecase.Params,
  ): Promise<ICreateProductUsecase.Response> {
    console.log({ message: 'Request received', data: params });



    const productExists = await this.getProductByNameRepository.get(params.name);

    if (productExists) {
      console.log({
        message: 'Product already exist',
        data: productExists,
      });

      throw new ProductAlreadyExistsException({ name: params.name });
    }

    const id = this.uuidGenerator.generate();

    const product = new Product({ id, name: params.name, description: params.description, cost: params.cost, quantity: params.quantity });

    const productCreated = await this.saveProductRepository.save(product);

    console.log({
      message: 'Product created',
      data: productCreated,
    });

    return productCreated;
  }
}
