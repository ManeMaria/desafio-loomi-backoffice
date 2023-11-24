import { PrismaClient } from '@prisma/client';

import { IGetProductByIdGateways } from '@/domains/order/usecases/gateways';

import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaGetProductByIdGateways
  implements IGetProductByIdGateways {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    id: IGetProductByIdGateways.Params,
  ): Promise<IGetProductByIdGateways.Result> {
    try {
      const productDTO = await this.prismaConnection.product.findFirst({
        where: { id, enabled: true },
        select: {
          quantity: true,
        },

      });

      if (!productDTO) {
        return null;
      }

      const product = productDTO;

      return product;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
