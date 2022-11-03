import { IFile } from '@/shared/interface/File/file-interface';

export namespace IXlsxToJson {
  export type Params = { file: IFile; sheetName: string };
}

export interface IXlsxToJson<T> {
  convert(params: IXlsxToJson.Params): T[];
}
