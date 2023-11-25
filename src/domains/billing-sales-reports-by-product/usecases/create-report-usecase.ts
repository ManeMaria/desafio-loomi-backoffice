
import { BillingSalesReportsByProduct } from '@/domains/billing-sales-reports-by-product/entities';
import { IGetDataFromReportByFilterRepository, IGCreateReportRepository, IGetReportsByFilterRepository } from '@/domains/billing-sales-reports-by-product/usecases/repos';
import { ReportNotFoundDataException } from '@/domains/billing-sales-reports-by-product/usecases/exceptions/report-not-found-data-exception';
import { IUuidGenerator } from '@/shared/protocols';
import { JsonToXlsxConverter } from '@/shared/infra/xlsx/json-to-xlsx';
import { IFile } from '@/shared/interface/File/file-interface';
import { ISignedUrlGenerator, IUploadArchive } from '@/shared/interface/s3-bucket';

export interface ICreateReportUsecase {
  execute(
    params: ICreateReportUsecase.Params,
  ): Promise<ICreateReportUsecase.Response>;
}

export namespace ICreateReportUsecase {
  export type Params = {
    startDate: Date;
    endDate: Date;
  };

  export type Response = Pick<BillingSalesReportsByProduct, 'csvPath'>;
}

export class CreateReportUsecase implements ICreateReportUsecase {
  private readonly date = new Date();

  constructor(
    private readonly prismaCreateReportsRepository: IGCreateReportRepository,
    private readonly prismaFindDataFromReportRepository: IGetDataFromReportByFilterRepository,
    private readonly prismaGetOrdersByFilterRepository: IGetReportsByFilterRepository,
    private readonly jsonToXlsxConverter: JsonToXlsxConverter<IGetDataFromReportByFilterRepository.Result[number]>,
    private readonly awsS3UploadArchive: IUploadArchive,
    private readonly awsS3SignedUrlGenerator: ISignedUrlGenerator,
    private readonly uuidGenerator: IUuidGenerator,

  ) { }

  async execute(
    params: ICreateReportUsecase.Params,
  ): Promise<ICreateReportUsecase.Response> {
    console.log({ message: 'Request received', data: params });

    const startDateProp = this.replaceDate(params.startDate);
    const endDateProp = this.replaceFinalDate(params.endDate);

    const queryOrders = await this.prismaGetOrdersByFilterRepository.get({
      startDate: startDateProp,
      endDate: endDateProp,
    });

    if (queryOrders) {

      return queryOrders
    }

    const query = await this.prismaFindDataFromReportRepository.get({
      startDate: startDateProp,
      endDate: endDateProp,
    });

    if (!query.length) {
      throw new ReportNotFoundDataException(query);
    }

    const fileName = `report-by-product.xlsx`;
    const file = this.jsonToXlsxConverter.convert({ data: query, sheetName: fileName });


    const fileUploaded = await this.awsS3UploadArchive.upload({ file: this.convertArrayBufferToFile(file, fileName) });

    const signedUrl = await this.awsS3SignedUrlGenerator.sign({
      url: fileUploaded,
    });

    const id = this.uuidGenerator.generate();

    const report = new BillingSalesReportsByProduct({
      id,
      csvPath: signedUrl,
      startDate: startDateProp,
      endDate: endDateProp,
    });

    const reportCreated = await this.prismaCreateReportsRepository.create(report)

    return reportCreated

  }

  private replaceDate(paramDate?: Date) {
    const dateNow = new Date(paramDate ?? '') || this.date;
    return dateNow
  }

  private replaceFinalDate(paramDate?: Date) {
    const dateNow = new Date(paramDate ?? '') || new Date(this.date.setMonth((this.date.getMonth() + 1) - 3));
    return dateNow
  }

  private convertArrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string) {
    const buffer = Buffer.from(arrayBuffer);
    const file = {
      buffer,
      filename: fileName,
      originalname: fileName,
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return file as IFile;
  }

}
