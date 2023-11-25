import { IGCreateReportRepository, IGetDataFromReportByFilterRepository, IGetReportsByFilterRepository } from '@/domains/billing-sales-reports-by-product/usecases/repos';
import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';
import { ReportTransformers } from '@/domains/billing-sales-reports-by-product/interface/presenters';
import { CreateReportUsecase } from '@/domains/billing-sales-reports-by-product/usecases/create-report-usecase';
import { JsonToXlsxConverter } from '@/shared/infra/xlsx/json-to-xlsx';
import { ISignedUrlGenerator, IUploadArchive } from '@/shared/interface/s3-bucket';

export interface CreateReportRequest {
  startDate: Date;
  endDate: Date;
}

export type CreateReportResponse = {
  csvPath: string;
};

export class CreateReportController {
  private usecase: CreateReportUsecase;


  constructor(
    prismaCreateReportsRepository: IGCreateReportRepository,
    prismaFindDataFromReportRepository: IGetDataFromReportByFilterRepository,
    prismaGetOrdersByFilterRepository: IGetReportsByFilterRepository,
    jsonToXlsxConverter: JsonToXlsxConverter<IGetDataFromReportByFilterRepository.Result[number]>,
    awsS3UploadArchive: IUploadArchive,
    awsS3SignedUrlGenerator: ISignedUrlGenerator,
    uuidGenerator: IUuidGenerator,
    private readonly validation: Validation,
  ) {
    this.usecase = new CreateReportUsecase(
      prismaCreateReportsRepository,
      prismaFindDataFromReportRepository,
      prismaGetOrdersByFilterRepository,
      jsonToXlsxConverter,
      awsS3UploadArchive,
      awsS3SignedUrlGenerator,
      uuidGenerator,
    );


  }

  async execute(
    request: CreateReportRequest
  ): Promise<CreateReportResponse> {

    const { endDate, startDate } = request;

    const hasError = this.validation.validate({
      endDate, startDate
    });

    if (hasError) {

      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const ReportCreated = await this.usecase.execute({ endDate, startDate });

    const reportCreatedPresenter =
      ReportTransformers.generateDefaultPresenter(ReportCreated);

    console.log({
      message: 'Report created',
      data: reportCreatedPresenter,
    });

    return reportCreatedPresenter;
  }
}
