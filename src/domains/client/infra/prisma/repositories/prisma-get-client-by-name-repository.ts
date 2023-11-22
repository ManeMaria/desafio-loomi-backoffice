import { Client as ClientModel, PrismaClient } from '@prisma/client';

import { IGetClientByNameRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetClientByNameRepository
  implements IGetClientByNameRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    name: IGetClientByNameRepository.Params,
  ): Promise<IGetClientByNameRepository.Result> {
    try {
      const clientDTO = await this.prismaConnection.client.findFirst({
        where: { name },
      });

      if (!clientDTO) {
        return null;
      }

      const client = new Client(convertNullToUndefined<ClientModel>(clientDTO));

      return client;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
