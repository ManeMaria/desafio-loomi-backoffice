import { PrismaClient } from '@prisma/client';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';
import { IUpdateProductGateways } from '@/domains/order/usecases/gateways';

export class PrismaUpdateProductGateways
  implements IUpdateProductGateways {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async update(
    productToUpdate: IUpdateProductGateways.Params,
  ): Promise<IUpdateProductGateways.Result> {
    try {
      const { id, quantity } = productToUpdate;

      await this.prismaConnection.product.update({
        where: { id },
        data: {
          quantity
        },
      });


    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
