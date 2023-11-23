import { Product as ProductModel, PrismaClient } from '@prisma/client';

import { ISaveProductRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaSaveProductRepository implements ISaveProductRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async save(
    productParams: ISaveProductRepository.Params,
  ): Promise<ISaveProductRepository.Result> {
    try {
      const { ...restProductParams } = productParams;

      const productDTO = await this.prismaConnection.product.create({
        data: restProductParams,
      });

      const product = new Product(convertNullToUndefined<ProductModel>(productDTO));

      return product;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
