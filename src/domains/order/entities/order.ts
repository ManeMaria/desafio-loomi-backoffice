import { OrderItems } from "@/domains/order/entities";

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  IN_PREPARATION = 'IN_PREPARATION',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
}

export type OrderConstructorParams = {
  id: string;
  status: string;
  totalOrder: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  clientId: string;
  orderItem?: OrderItems[];
}

export class Order {
  id: string;
  totalOrder: number;
  status: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  clientId: string
  orderItems?: OrderItems[]

  constructor(orderParams: OrderConstructorParams) {
    const {
      id,
      enabled,
      status,
      createdAt,
      updatedAt,
      totalOrder,
      // association
      clientId,
      orderItem
    } = orderParams;

    this.id = id;
    this.enabled = enabled;
    this.status = status;
    this.totalOrder = totalOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.clientId = clientId;
    this.orderItems = orderItem ?? [];

    Object.freeze(this);
  }
}
