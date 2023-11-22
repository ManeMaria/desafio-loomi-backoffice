import { PrismaClient } from '@prisma/client';

import { IDeleteClientByIdRepository } from '@/domains/client/usecases/repos';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaDeleteClientByIdRepository
  implements IDeleteClientByIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async delete(
    {
      id,
      data
    }: IDeleteClientByIdRepository.Params,

  ): Promise<IDeleteClientByIdRepository.Result> {
    try {
      await this.prismaConnection.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
