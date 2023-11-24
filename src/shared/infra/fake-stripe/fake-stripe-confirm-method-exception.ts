import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

export class StripeConfirmMethodException extends DefaultException {
  constructor(errorType: string, error?: any) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: error?.raw?.code ?? 'STRIPE_CONFIRM_METHOD_EXCEPTION',
      data: error?.raw ?? errorType,
      message: error?.raw?.message ?? errorType,
    });
  }
}
