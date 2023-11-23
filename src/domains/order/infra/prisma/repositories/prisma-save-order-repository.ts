import { Order as OrderModel, PrismaClient } from '@prisma/client';

import { ISaveOrderRepository } from '@/domains/order/usecases/repos';
import { Order } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaSaveOrderRepository implements ISaveOrderRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async save(
    orderParams: ISaveOrderRepository.Params,
  ): Promise<ISaveOrderRepository.Result> {
    try {
      const { clientId, id, totalOrder, status } = orderParams;

      const orderDTO = await this.prismaConnection.order.create({
        data: {
          clientId,
          id,
          totalOrder,
          status
        },
      });

      const order = new Order(convertNullToUndefined<OrderModel>(orderDTO));

      return order;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
