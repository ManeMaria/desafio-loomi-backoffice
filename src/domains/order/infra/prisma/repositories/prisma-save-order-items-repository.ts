import { PrismaClient } from '@prisma/client';

import { ISaveOrderItemsRepository } from '@/domains/order/usecases/repos';
import { OrderItems } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';


export class PrismaSaveOrderItemsRepository implements ISaveOrderItemsRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async save(
    orderItemsParams: ISaveOrderItemsRepository.Params,
  ): Promise<ISaveOrderItemsRepository.Result> {
    try {

      await this.prismaConnection.orderItem.createMany({
        data: orderItemsParams,
      });

      const orderItems = this.setIdsInOrderItems(orderItemsParams)

      return orderItems;
    } catch (error) {
      throw new PrismaException(error);
    }
  }

  private setIdsInOrderItems(orderItems: ISaveOrderItemsRepository.Params) {
    return orderItems.map(orderItem => new OrderItems(convertNullToUndefined(orderItem)))
  }
}
