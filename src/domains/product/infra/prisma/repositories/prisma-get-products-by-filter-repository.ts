import { Product as ProductModel, PrismaClient } from '@prisma/client';

import { IGetProductsByFilterRepository } from '@/domains/product/usecases/repos';
import { Product } from '@/domains/product/entities';

import { convertNullToUndefined } from '@/shared/helpers';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaGetProductsByFilterRepository
  implements IGetProductsByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    filter: IGetProductsByFilterRepository.Params,
  ): Promise<IGetProductsByFilterRepository.Result> {
    try {
      const {
        orderBy,
        pagination,
        filters,
      } = filter;

      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const productDTOs = await this.prismaConnection.product.findMany({
        where: filtersFormated,
        orderBy: { [orderBy.property]: orderBy.mode },
        take: pagination.take,
        skip: pagination.skip,
      });

      const products = productDTOs.map((productDTO) => {
        return new Product(convertNullToUndefined<ProductModel>(productDTO));
      });

      return products;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
