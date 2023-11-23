import { Order as OrderModel, PrismaClient } from '@prisma/client';

import { IUpdateOrderRepository } from '@/domains/order/usecases/repos';
import { Order } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaUpdateOrderRepository
  implements IUpdateOrderRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async update(
    orderToUpdate: IUpdateOrderRepository.Params,
  ): Promise<IUpdateOrderRepository.Result> {
    try {
      const { id, ...restOfOrderParams } = orderToUpdate;

      const orderDTO = await this.prismaConnection.order.update({
        where: { id },
        data: restOfOrderParams,
      });

      const order = new Order(convertNullToUndefined<OrderModel>(orderDTO));

      return order;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
