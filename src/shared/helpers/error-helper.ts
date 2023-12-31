export enum ExceptionTypes {
  USER = 'USER',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  ORDER_ITEM = 'ORDER_ITEM',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  UNKNOWN = 'UNKNOW',
  REPORT = 'REPORT',

}

export interface Exception {
  type: ExceptionTypes;
  code: string;
  data?: any;
  message?: string;
}

export class DefaultException extends Error implements Exception {
  type: ExceptionTypes;
  code: string;
  data?: any;

  constructor(exception: Exception) {
    super(exception.message);
    this.code = exception.code;
    this.type = exception.type;
    this.data = exception.data;
  }
}
