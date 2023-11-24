import { OrderItems } from '@/domains/order/entities';
import {
  OrderItemDefaultPresenter,
} from '@/domains/order/interface/presenters';

export class OrderItemTransformers {
  static generateDefaultPresenter(orderItem: OrderItems): OrderItemDefaultPresenter {
    return {
      id: orderItem.id,
      quantity: orderItem.quantity,
      costPerItem: orderItem.costPerItem,
      subTotal: orderItem.subTotal,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,

      // association
      orderId: orderItem.orderId,
      productId: orderItem.productId,
    };
  }
}
