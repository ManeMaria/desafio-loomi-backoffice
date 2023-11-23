import { Client as ClientModel, PrismaClient } from '@prisma/client';

import { IGetClientsByFilterRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';

import { convertNullToUndefined } from '@/shared/helpers';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaGetClientsByFilterRepository
  implements IGetClientsByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    filter: IGetClientsByFilterRepository.Params,
  ): Promise<IGetClientsByFilterRepository.Result> {
    try {
      const {
        orderBy,
        pagination,
        filters,
      } = filter;

      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const clientDTOs = await this.prismaConnection.client.findMany({
        where: filtersFormated,
        include: {
          order: true,
        },

        orderBy: { [orderBy.property]: orderBy.mode },
        take: pagination.take,
        skip: pagination.skip,
      });

      const clients = clientDTOs.map((clientDTO) => {
        return new Client(convertNullToUndefined<ClientModel>(clientDTO));
      });

      return clients;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
