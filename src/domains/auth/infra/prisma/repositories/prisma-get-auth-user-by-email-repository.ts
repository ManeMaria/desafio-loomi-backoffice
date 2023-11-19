import { PrismaClient } from '@prisma/client';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

import { IGetAuthUserByEmailRepository } from '@/domains/auth/usecases/repos';

export class PrismaGetAuthUserByEmailRepository
  implements IGetAuthUserByEmailRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(email: string): IGetAuthUserByEmailRepository.Result {
    try {
      const [user] = await this.prismaConnection.user.findMany({
        where: { email, enabled: true },
        select: {
          id: true,
          type: true,
          email: true,
          name: true,
        },
      });

      return user;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
