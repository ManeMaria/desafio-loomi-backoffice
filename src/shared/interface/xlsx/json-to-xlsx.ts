export namespace IJsonToXlsx {
  export type Params<T> = { data: T[]; sheetName: string };
}

export interface IJsonToXlsx<T> {
  convert(params: IJsonToXlsx.Params<T>): ArrayBuffer;
}
