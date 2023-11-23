import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';


import {
  Order,
} from '@/domains/order/entities';

export class OrderNotFoundException extends DefaultException {
  constructor(order: Partial<Order>) {
    super({
      type: ExceptionTypes.ORDER,
      code: 'ORDER_NOT_FOUND',
      data: order,
    });
  }
}
