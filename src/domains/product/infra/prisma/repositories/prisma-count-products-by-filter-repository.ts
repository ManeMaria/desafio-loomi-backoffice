import { PrismaClient } from '@prisma/client';

import { ICountProductsByFilterRepository } from '@/domains/product/usecases/repos';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaCountProductsByFilterRepository
  implements ICountProductsByFilterRepository
{
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async count(
    filters: ICountProductsByFilterRepository.Params,
  ): Promise<ICountProductsByFilterRepository.Result> {
    try {
      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const totalProducts = await this.prismaConnection.product.count({
        where: {
          ...filtersFormated,
          enabled: filters.enabled ?? true,
        },
      });

      return totalProducts;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
