import { PrismaClient } from '@prisma/client';

import { ICountClientsByFilterRepository } from '@/domains/client/usecases/repos';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaCountClientsByFilterRepository
  implements ICountClientsByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async count(
    filters: ICountClientsByFilterRepository.Params,
  ): Promise<ICountClientsByFilterRepository.Result> {
    try {
      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const totalClients = await this.prismaConnection.client.count({
        where: filtersFormated,
      });

      return totalClients;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
