import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';
import { PrismaCreateReportsRepository, PrismaFindDataFromReportRepository, PrismaGetOrdersByFilterRepository } from '@/domains/billing-sales-reports-by-product/infra/prisma/repositories';
import { makeGetReportByFilterValidation } from '@/domains/billing-sales-reports-by-product/interface/validation';
import { HttpCreateReportController } from '@/domains/billing-sales-reports-by-product/interface/http';
import { JsonToXlsxConverter } from '@/shared/infra/xlsx/json-to-xlsx';
import { AwsS3UploadArchive, AwsS3SignedUrlGenerator } from '@/shared/infra/s3-bucket';

export const makeHttpCreateController = (): HttpCreateReportController => {
  const prismaCreateReportsRepository = new PrismaCreateReportsRepository();
  const prismaFindDataFromReportRepository = new PrismaFindDataFromReportRepository();
  const prismaGetOrdersByFilterRepository = new PrismaGetOrdersByFilterRepository()

  const jsonToXlsxConverter = new JsonToXlsxConverter<any>();

  const awsS3UploadArchive = new AwsS3UploadArchive();
  const awsS3SignedUrlGenerator = new AwsS3SignedUrlGenerator()
  const validation = makeGetReportByFilterValidation();
  const uuidGeneratorAdapter = new UUIDGeneratorAdapter();

  return new HttpCreateReportController(
    prismaCreateReportsRepository,
    prismaFindDataFromReportRepository,
    prismaGetOrdersByFilterRepository,
    jsonToXlsxConverter,
    awsS3UploadArchive,
    awsS3SignedUrlGenerator,
    uuidGeneratorAdapter,
    validation,

  );
};
