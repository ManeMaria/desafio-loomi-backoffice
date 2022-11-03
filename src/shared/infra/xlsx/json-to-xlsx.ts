import { IJsonToXlsx } from '@/shared/interface/xlsx/json-to-xlsx';
import XLSX from 'xlsx';

export class JsonToXlsxConverter<T> implements IJsonToXlsx<T> {
  convert(params: IJsonToXlsx.Params<T>): ArrayBuffer {
    const { data, sheetName } = params;

    const jsonToSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const xlsxWorkBook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(xlsxWorkBook, jsonToSheet, sheetName);

    // O retorno seguinte retorna um ArrayBuffer (Conforme aplicado no spaceflix)

    const xlsxAsBuffer: ArrayBuffer = XLSX.write(xlsxWorkBook, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array',
    });

    return xlsxAsBuffer;

    // Esse retorno retorna o arquivo xlsx
    // return XLSX.writeFile(xlsxInstace, `${sheetName}.xlsx`) <- Podendo o sheetName ser substituido pelo nome que quiser dar ao arquivo.
  }
}
