import { BillingSalesReportsByProduct } from "@/domains/billing-sales-reports-by-product/entities";


export interface IGCreateReportRepository {
  create(
    filters: IGCreateReportRepository.Params,
  ): Promise<IGCreateReportRepository.Result>;
}

export namespace IGCreateReportRepository {
  export type Params = BillingSalesReportsByProduct;


  export type Result = {
    csvPath: string;
  };
}
