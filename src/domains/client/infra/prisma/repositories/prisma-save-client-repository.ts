import { Client as ClientModel, PrismaClient } from '@prisma/client';

import { ISaveClientRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaSaveClientRepository implements ISaveClientRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async save(
    clientParams: ISaveClientRepository.Params,
  ): Promise<ISaveClientRepository.Result> {
    try {
      const { ...restClientParams } = clientParams;

      const clientDTO = await this.prismaConnection.client.create({
        data: restClientParams,
      });

      const client = new Client(convertNullToUndefined<ClientModel>(clientDTO));

      return client;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
