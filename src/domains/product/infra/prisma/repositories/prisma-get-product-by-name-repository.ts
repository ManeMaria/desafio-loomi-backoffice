import { Product as ProductModel, PrismaClient } from '@prisma/client';

import { IGetProductByNameRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetProductByNameRepository
  implements IGetProductByNameRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    name: IGetProductByNameRepository.Params,
  ): Promise<IGetProductByNameRepository.Result> {
    try {
      const productDTO = await this.prismaConnection.product.findFirst({
        where: { name },
      });

      if (!productDTO) {
        return null;
      }

      const product = new Product(convertNullToUndefined<ProductModel>(productDTO));

      return product;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
