import { Order, OrderItems } from '@/domains/order/entities';
import {
  OrderDefaultPresenter,
} from '@/domains/order/interface/presenters';

type OrderDefaultPresenterParams = Order & {
  orderItems?: OrderItems[];
}
export class OrderTransformers {
  static generateDefaultPresenter(order: OrderDefaultPresenterParams): OrderDefaultPresenter {
    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      totalOrder: order.totalOrder,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      // association
      orderItems: order.orderItems || [],
    };
  }
}
