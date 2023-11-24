import { Order as OrderModel, PrismaClient } from '@prisma/client';

import { IGetOrdersByFilterRepository } from '@/domains/order/usecases/repos';
import { Order } from '@/domains/order/entities';

import { convertNullToUndefined } from '@/shared/helpers';

import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaGetOrdersByFilterRepository
  implements IGetOrdersByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    filter: IGetOrdersByFilterRepository.Params,
  ): Promise<IGetOrdersByFilterRepository.Result> {
    try {
      const {
        orderBy,
        pagination,
        filters,
      } = filter;

      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const orderDTOs = await this.prismaConnection.order.findMany({
        where: filtersFormated,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              contact: true,
              address: true,
            }
          },
          orderItem: {
            select: {
              id: true,
              quantity: true,
              subTotal: true,
            },
          },

        },
        orderBy: { [orderBy.property]: orderBy.mode },
        take: pagination.take,
        skip: pagination.skip,
      });


      const orders = orderDTOs.map((orderDTO) => {
        return new Order(convertNullToUndefined<OrderModel>(orderDTO));
      });

      return orders;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
