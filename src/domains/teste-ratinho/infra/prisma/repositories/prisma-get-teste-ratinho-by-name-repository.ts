import { IGetTesteRatinhoByNameRepository } from '@/domains/teste-ratinho';
import { PrismaClient } from '@prisma/client';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetTesteRatinhoByNameRepository
  implements IGetTesteRatinhoByNameRepository
{
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    name: IGetTesteRatinhoByNameRepository.Params
  ): Promise<IGetTesteRatinhoByNameRepository.Result> {
    try {
      const [testeRatinho] = await this.prismaConnection.testeRatinho.findMany({
        where: { name },
      });

      return testeRatinho;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
