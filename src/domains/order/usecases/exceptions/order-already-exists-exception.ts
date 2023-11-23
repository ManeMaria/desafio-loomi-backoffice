import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

import {
  Order,
} from '@/domains/order/entities';

export class OrderAlreadyExistsException extends DefaultException {
  constructor(order: Partial<Order>) {
    super({
      type: ExceptionTypes.ORDER,
      code: 'ORDER_ALREADY_EXISTS',
      data: order,
    });
  }
}
