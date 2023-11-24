import { OrderItem as OrderItemsModel, PrismaClient } from '@prisma/client';

import { IGetOrderItemsByOrderIdRepository } from '@/domains/order/usecases/repos';
import { OrderItems } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetOrderItemsByOrderIdRepository
  implements IGetOrderItemsByOrderIdRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    orderId: IGetOrderItemsByOrderIdRepository.Params,
  ): Promise<IGetOrderItemsByOrderIdRepository.Result> {
    try {
      const orderItemsDTO = await this.prismaConnection.orderItem.findMany({
        where: { orderId },
        include: {
          product: true,
        }
      });

      if (!orderItemsDTO.length) {
        return null;
      }

      const orderItems = this.mapOrderItems(orderItemsDTO)

      return orderItems;
    } catch (error) {
      throw new PrismaException(error);
    }
  }


  mapOrderItems(orderItems: OrderItemsModel[]): OrderItems[] {
    return orderItems.map((orderItem) => {
      return new OrderItems(convertNullToUndefined<OrderItemsModel>(orderItem));
    });
  }
}
