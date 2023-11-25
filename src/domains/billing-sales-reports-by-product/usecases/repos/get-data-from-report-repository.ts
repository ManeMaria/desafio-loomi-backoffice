

export interface IGetDataFromReportByFilterRepository {
  get(
    filters: IGetDataFromReportByFilterRepository.Params,
  ): Promise<IGetDataFromReportByFilterRepository.Result>;
}

export namespace IGetDataFromReportByFilterRepository {
  export type Params = {
    startDate: Date;
    endDate: Date;
  };


  export type Result = {
    productid: string
    productname: string
    totalsold: number
    totalrevenue: number
  }[];
}
