import { Product as ProductModel, PrismaClient } from '@prisma/client';

import { IUpdateProductRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaUpdateProductRepository
  implements IUpdateProductRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async update(
    productToUpdate: IUpdateProductRepository.Params,
  ): Promise<IUpdateProductRepository.Result> {
    try {
      const { id, ...restOfProductParams } = productToUpdate;

      const productDTO = await this.prismaConnection.product.update({
        where: { id },
        data: restOfProductParams,
      });

      const product = new Product(convertNullToUndefined<ProductModel>(productDTO));

      return product;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
