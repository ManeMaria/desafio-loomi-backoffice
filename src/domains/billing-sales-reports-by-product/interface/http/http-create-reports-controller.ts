






import {
  HttpController,
  HttpResponse,
} from '@/shared/interface/http/protocols';
import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';
import { badRequest, created, serverError } from '@/shared/interface/http/helpers';
import { IUuidGenerator } from '@/shared/protocols';

import { IGetDataFromReportByFilterRepository, IGCreateReportRepository, IGetReportsByFilterRepository } from '@/domains/billing-sales-reports-by-product/usecases/repos';
import { CreateReportController } from '@/domains/billing-sales-reports-by-product/interface/controllers';
import { JsonToXlsxConverter } from '@/shared/infra/xlsx/json-to-xlsx';
import { IUploadArchive, ISignedUrlGenerator } from '@/shared/interface/s3-bucket';



export interface HttpCreateReportRequest {
  endDate: Date, startDate: Date
}

export class HttpCreateReportController implements HttpController {
  private controller: CreateReportController;


  constructor(
    prismaCreateReportsRepository: IGCreateReportRepository,
    prismaFindDataFromReportRepository: IGetDataFromReportByFilterRepository,
    prismaGetOrdersByFilterRepository: IGetReportsByFilterRepository,
    jsonToXlsxConverter: JsonToXlsxConverter<IGetDataFromReportByFilterRepository.Result[number]>,
    awsS3UploadArchive: IUploadArchive,
    awsS3SignedUrlGenerator: ISignedUrlGenerator,
    uuidGenerator: IUuidGenerator,
    validation: Validation,

  ) {
    this.controller = new CreateReportController(
      prismaCreateReportsRepository,
      prismaFindDataFromReportRepository,
      prismaGetOrdersByFilterRepository,
      jsonToXlsxConverter,
      awsS3UploadArchive,
      awsS3SignedUrlGenerator,
      uuidGenerator,
      validation,

    );

  }


  async handle(httpRequest: HttpCreateReportRequest): Promise<HttpResponse> {
    console.log({ message: 'Request Received', data: httpRequest });



    try {
      const report = await this.controller.execute({
        ...httpRequest
      });

      console.log({
        message: 'Report created',
        data: report,
      });

      return created(report);
    } catch (error) {
      if (error instanceof ValidationException) {
        return badRequest(error);
      }

      return serverError(error as Error);
    }
  }
}
