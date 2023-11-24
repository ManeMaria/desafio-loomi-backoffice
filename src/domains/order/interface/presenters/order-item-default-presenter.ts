// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoOrder,
* } from '@/domains/order/entities';
*/

export interface OrderItemDefaultPresenter {
  id: string;
  quantity: number;
  costPerItem: number; // product.price
  subTotal: number; // costPerItem x quantity
  createdAt?: Date;
  updatedAt?: Date;

  // association
  orderId: string;
  productId: string;
  // association
  // entity_included?: Array<EntityIncludedIntoOrder>;
}
