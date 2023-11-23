import { Product as ProductModel, PrismaClient } from '@prisma/client';

import { IGetProductByIdRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetProductByIdRepository
  implements IGetProductByIdRepository
{
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    id: IGetProductByIdRepository.Params,
  ): Promise<IGetProductByIdRepository.Result> {
    try {
      const productDTO = await this.prismaConnection.product.findFirst({
        where: { id, enabled: true },
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
