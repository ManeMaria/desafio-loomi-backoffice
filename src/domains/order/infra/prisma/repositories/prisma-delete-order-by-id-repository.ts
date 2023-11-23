import { PrismaClient } from '@prisma/client';

import { IDeleteOrderByIdRepository } from '@/domains/order/usecases/repos';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaDeleteOrderByIdRepository
  implements IDeleteOrderByIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async delete(
    {
      id,
      data,
    }: IDeleteOrderByIdRepository.Params,
  ): Promise<IDeleteOrderByIdRepository.Result> {
    try {
      await this.prismaConnection.order.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
