import { Order as OrderModel, PrismaClient } from '@prisma/client';

import { IGetOrderByIdRepository } from '@/domains/order/usecases/repos';
import { Order } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetOrderByIdRepository
  implements IGetOrderByIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    id: IGetOrderByIdRepository.Params,
  ): Promise<IGetOrderByIdRepository.Result> {
    try {
      const orderDTO = await this.prismaConnection.order.findFirst({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              contact: true,
              address: true,
            },
          },
        },
      });

      if (!orderDTO) {
        return null;
      }

      const order = new Order(convertNullToUndefined<OrderModel>(orderDTO));

      return order;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
