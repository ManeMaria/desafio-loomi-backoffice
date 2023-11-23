import { PrismaClient } from '@prisma/client';

import { ICountOrdersByFilterRepository } from '@/domains/order/usecases/repos';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaCountOrdersByFilterRepository
  implements ICountOrdersByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async count(
    filters: ICountOrdersByFilterRepository.Params,
  ): Promise<ICountOrdersByFilterRepository.Result> {
    try {
      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const totalOrders = await this.prismaConnection.order.count({
        where: filtersFormated,
      });

      return totalOrders;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
