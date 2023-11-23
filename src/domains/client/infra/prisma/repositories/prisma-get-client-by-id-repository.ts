import { Client as ClientModel, PrismaClient } from '@prisma/client';

import { IGetClientByIdRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetClientByIdRepository
  implements IGetClientByIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    id: IGetClientByIdRepository.Params,
  ): Promise<IGetClientByIdRepository.Result> {
    try {
      const clientDTO = await this.prismaConnection.client.findFirst({
        where: { id },
        include: {
          order: true,
        },
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
