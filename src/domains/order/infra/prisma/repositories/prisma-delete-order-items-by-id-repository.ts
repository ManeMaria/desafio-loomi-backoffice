import { PrismaClient } from '@prisma/client';

import { IDeleteOrderItemsByOrderIdRepository } from '@/domains/order/usecases/repos';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaDeleteOrderItemsByIdRepository
  implements IDeleteOrderItemsByOrderIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async delete(
    id: IDeleteOrderItemsByOrderIdRepository.Params,
  ): Promise<IDeleteOrderItemsByOrderIdRepository.Result> {
    try {
      await this.prismaConnection.orderItem.delete({
        where: { id },
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
