import { DefaultException, ExceptionTypes } from '@/shared/helpers';

export class XlsxException extends DefaultException {
  constructor(error: any, errorType: 'Table Without Data') {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'XLSX NO DATA',
      data: error,
      message: errorType,
    });
  }
}
