import { Client as ClientModel, PrismaClient } from '@prisma/client';

import { IUpdateClientRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaUpdateClientRepository
  implements IUpdateClientRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async update(
    clientToUpdate: IUpdateClientRepository.Params,
  ): Promise<IUpdateClientRepository.Result> {
    try {
      const { id, ...restOfClientParams } = clientToUpdate;

      const clientDTO = await this.prismaConnection.client.update({
        where: { id },
        data: restOfClientParams,
      });

      const client = new Client(convertNullToUndefined<ClientModel>(clientDTO));

      return client;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
