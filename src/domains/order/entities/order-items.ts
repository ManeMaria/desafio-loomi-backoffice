// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoOrderItems,
* } from '@/domains/order-items/entities';
*/

export type OrderItemsConstructorParams = {
  id: string;
  quantity: number;
  costPerItem: number; // product.price
  subTotal: number; // costPerItem x quantity
  createdAt?: Date;
  updatedAt?: Date;

  // association
  orderId: string;
  productId: string;
}

export class OrderItems {
  id: string;
  quantity: number;
  costPerItem: number;
  subTotal: number;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  orderId: string;
  productId: string;

  constructor(orderItemsParams: OrderItemsConstructorParams) {
    const {
      id,
      costPerItem,
      quantity,
      subTotal,
      orderId,
      productId,
      createdAt,
      updatedAt,

      // association
      // inclusionName,
    } = orderItemsParams;

    this.id = id;
    this.costPerItem = costPerItem;
    this.quantity = quantity;
    this.subTotal = subTotal;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.orderId = orderId;
    this.productId = productId;

    Object.freeze(this);
  }
}
