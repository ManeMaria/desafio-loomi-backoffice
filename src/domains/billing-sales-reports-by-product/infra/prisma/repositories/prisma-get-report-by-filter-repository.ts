import { PrismaClient } from '@prisma/client';

import { IGetReportsByFilterRepository } from '@/domains/billing-sales-reports-by-product/usecases/repos';


import {
  prismaConnector,
  PrismaFormatter,
  PrismaException,
} from '@/shared/infra/prisma';

export class PrismaGetOrdersByFilterRepository
  implements IGetReportsByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    filters: IGetReportsByFilterRepository.Params,
  ): Promise<IGetReportsByFilterRepository.Result> {
    try {


      const filtersFormated = PrismaFormatter.formatFilter(filters);

      const reportDTOs = await this.prismaConnection.report.findFirst({
        where: filtersFormated,
        select: {
          csvPath: true,
        }
      });

      return reportDTOs;
    } catch (error) {
      throw new PrismaException(error);
    }
  }
}
