import { PrismaClient, Report as ReportModel } from '@prisma/client';
import { BillingSalesReportsByProduct } from '@/domains/billing-sales-reports-by-product/entities';
import { IGCreateReportRepository } from '@/domains/billing-sales-reports-by-product/usecases/repos/create-report-repository';
import { convertNullToUndefined } from '@/shared/helpers';
import { prismaConnector, PrismaException } from '@/shared/infra/prisma';

export class PrismaCreateReportsRepository
  implements IGCreateReportRepository {
  private prismaConnection: PrismaClient;

  constructor() {
    this.prismaConnection = prismaConnector.connect();
  }

  async create(
    params: IGCreateReportRepository.Params
  ): Promise<IGCreateReportRepository.Result> {
    try {
      const {
        id,
        csvPath,
        enabled,
        endDate,
        startDate,
      } = params;

      const reportDTO = await this.prismaConnection.report.create({
        data: {
          id,
          csvPath,
          enabled,
          endDate,
          startDate,
        },
      });

      const report = new BillingSalesReportsByProduct(convertNullToUndefined<ReportModel>(reportDTO));
      return report
    } catch (error) {
      throw new PrismaException(error);
    }
  }


}
