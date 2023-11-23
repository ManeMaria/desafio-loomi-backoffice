import { PrismaClient } from '@prisma/client';

import { IDeleteProductByIdRepository } from '@/domains/product/usecases/repos';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaDeleteProductByIdRepository
  implements IDeleteProductByIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async delete(
    {
      id,
      data
    }: IDeleteProductByIdRepository.Params,
  ): Promise<IDeleteProductByIdRepository.Result> {
    try {
      await this.prismaConnection.product.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
