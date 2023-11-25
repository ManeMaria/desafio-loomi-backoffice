import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

export class ReportNotFoundDataException extends DefaultException {
  constructor(client: any) {
    super({
      type: ExceptionTypes.REPORT,
      code: 'REPORT_NOT_FOUND_DATA',
      data: client,
    });
  }
}
