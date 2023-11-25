
export interface IGetReportsByFilterRepository {
  get(
    filters: IGetReportsByFilterRepository.Params,
  ): Promise<IGetReportsByFilterRepository.Result>;
}

export namespace IGetReportsByFilterRepository {
  export type Params = {
    startDate: Date;
    endDate: Date;
  };


  export type Result = {
    csvPath: string;
  } | null;
}
