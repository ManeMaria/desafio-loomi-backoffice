import {
  IGetProductByIdRepository,
  IGetProductByNameRepository,
  IUpdateProductRepository,
} from '@/domains/product/usecases/repos';
import {
  ProductNotFoundException,
  ProductAlreadyExistsException,
} from '@/domains/product/usecases/exceptions';
import {
  Product,
} from '@/domains/product/entities';



export interface IUpdateProductByIdUsecase {
  execute(
    updateParams: IUpdateProductByIdUsecase.Params,
  ): Promise<IUpdateProductByIdUsecase.Result>;
}

export namespace IUpdateProductByIdUsecase {
  export type Params = {
    id: string;
    paramsToUpdate: {
      name?: string;
      description?: string;
      cost?: number;
      quantity?: number;
      enabled?: boolean;
    };
  };
  export type Result = Product;
}

export class UpdateProductByIdUsecase implements IUpdateProductByIdUsecase {


  constructor(
    private readonly getProductByIdRepository: IGetProductByIdRepository,
    private readonly getProductByNameRepository: IGetProductByNameRepository,
    private readonly updateProductRepository: IUpdateProductRepository,

  ) {

  }

  async execute(
    updateParams: IUpdateProductByIdUsecase.Params,
  ): Promise<IUpdateProductByIdUsecase.Result> {
    console.log({ message: 'Request received', data: updateParams });

    const { id, paramsToUpdate } = updateParams;

    const productExists = await this.getProductByIdRepository.get(id);

    if (!productExists) {
      console.log({
        message: 'Product found',
        data: updateParams,
      });

      throw new ProductNotFoundException({ id });
    }

    console.log({
      message: 'Product found',
      data: productExists,
    });

    const productToUpdate = new Product({
      ...productExists,
      ...(paramsToUpdate.name && { name: paramsToUpdate.name }),
      ...(paramsToUpdate.description && {
        description: paramsToUpdate.description,
      }),
      ...(paramsToUpdate.cost && { cost: paramsToUpdate.cost }),
      ...(paramsToUpdate.quantity && { quantity: paramsToUpdate.quantity }),
    });

    if (paramsToUpdate.name) {
      const isProduct = await this.getProductByNameRepository.get(
        paramsToUpdate.name
      );

      if (isProduct && isProduct.id !== id) {
        console.log({
          message: 'Product already exist',
          data: isProduct,
        });

        throw new ProductAlreadyExistsException({
          name: productToUpdate.name,
        });
      }
    }

    const productUpdated = await this.updateProductRepository.update(
      productToUpdate,
    );

    console.log({
      message: 'Product updated',
      data: productUpdated,
    });

    return productUpdated;
  }
}
