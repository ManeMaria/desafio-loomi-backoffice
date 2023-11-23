import { Order } from '@/domains/order/entities';
import {
  OrderDefaultPresenter,
} from '@/domains/order/interface/presenters';

export class OrderTransformers {
  static generateDefaultPresenter(order: Order): OrderDefaultPresenter {
    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      totalOrder: order.totalOrder,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      // association
      // inclusion_name: order.entityIncluded,
    };
  }
}
