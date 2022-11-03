import { IXlsxToJson } from '@/shared/interface/xlsx/xlsx-to-json';
import XLSX from 'xlsx';
import { XlsxException } from './xlsx-exception';

/*
Onde T é a tipagem do objeto que será extraído da planilha, A tipagem deve ser no formato de Objeto do JavaScript({chave: valor}),
com a chave sendo o header, com as seguintes propriedades:
- String;
- LowerCase;
- Kebab-Case;
- Sem acentos.
Pois na execução da função irá ser feito esse tratamento do header, tratando a string com as definições descritas acima.

Exemplo:
- 'NoMe' será transformado para 'nome';
- 'Endereço' ficará como 'endereco';
- 'Data de Nascimento' ficará como 'data-de-nascimento'
*/

export class XlsxToJsonConverter<T> implements IXlsxToJson<T> {
  convert(params: IXlsxToJson.Params): T[] {
    const { file, sheetName } = params;

    const workBook: XLSX.WorkBook = XLSX.read(file.buffer, {
      cellDates: true,
    });

    const workBookSheet: XLSX.WorkSheet = workBook.Sheets[sheetName];

    if (!workBookSheet) {
      const error = 'Verify sheetname';
      throw new XlsxException(error, 'Table Without Data');
    }

    const toJsonObject: object[] = XLSX.utils.sheet_to_json(workBookSheet);

    if (!toJsonObject[0]) {
      const error = 'Data Not Found in Table';
      throw new XlsxException(error, 'Table Without Data');
    }

    const headersFixed: string[] = Object.keys(toJsonObject[0]).map(
      (header) => {
        header = header.toLowerCase();
        header = header.trim();
        header = header.replace(/( )+/g, '-');
        header = header.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return header;
      }
    );

    const workBookWithCorrectHeader: XLSX.WorkSheet = XLSX.utils.sheet_add_aoa(
      workBookSheet,
      [headersFixed],
      { origin: 'A1' }
    );

    const jsonObject: T[] = XLSX.utils
      .sheet_to_json(workBookWithCorrectHeader)
      .map((data) => data as T);

    return jsonObject;
  }
}
