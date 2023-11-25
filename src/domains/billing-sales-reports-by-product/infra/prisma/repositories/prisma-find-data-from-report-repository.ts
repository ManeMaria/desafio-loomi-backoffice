

import {
  IGetDataFromReportByFilterRepository
} from '@/domains/billing-sales-reports-by-product/usecases/repos';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';
import { PrismaClient } from '@prisma/client';

export class PrismaFindDataFromReportRepository
  implements IGetDataFromReportByFilterRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async get(
    params: IGetDataFromReportByFilterRepository.Params
  ): Promise<IGetDataFromReportByFilterRepository.Result> {
    try {
      const {
        startDate,
        endDate
      } = params;

      const billingSalesReportsByProductMade = await this.prismaConnection.$queryRaw<IGetDataFromReportByFilterRepository.Result>`
       SELECT
        p."id" AS productId,
        p.name AS productName,
        SUM(oi."quantity") AS totalSold,
        SUM(oi."subTotal") AS totalRevenue
      FROM
        order_items AS oi
      INNER JOIN
        product AS p ON oi."productId" = p.id
      INNER JOIN
        "order" AS o ON oi."orderId" = o.id
      WHERE
        o.enabled = true and
        p.enabled = true and
        o.created_at BETWEEN ${startDate} and ${endDate}
      GROUP BY
        p.id, p."name";
      `

      return billingSalesReportsByProductMade;
    } catch (error) {
      throw new PrismaException(error);
    }
  }

}
