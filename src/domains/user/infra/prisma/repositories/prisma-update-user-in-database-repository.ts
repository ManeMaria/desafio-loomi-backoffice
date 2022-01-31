import { IUpdateUserRepository } from '@/domains/user';
import { prismaConnector } from '@/shared/infra/prisma';
import { PrismaClient } from '@prisma/client';

export class PrismaUpdateUserRepository implements IUpdateUserRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async update(
    userToUpdate: IUpdateUserRepository.Params
  ): Promise<IUpdateUserRepository.Result> {
    const { id, ...restOfUserInJSON } = userToUpdate;

    const userUpdated = await this.prismaConnection.user.update({
      where: { id },
      data: restOfUserInJSON,
    });

    return userUpdated;
  }
}
