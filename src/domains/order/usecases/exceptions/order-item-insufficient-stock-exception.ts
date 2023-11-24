import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';


import {
  OrderItems
} from '@/domains/order/entities';

export class OrderItemInsufficientStockException extends DefaultException {
  constructor(orderItem: Partial<OrderItems>) {
    super({
      type: ExceptionTypes.ORDER_ITEM,
      code: 'ORDER_ITEM_INSUFFICIENT_STOCK',
      data: orderItem,
    });
  }
}
