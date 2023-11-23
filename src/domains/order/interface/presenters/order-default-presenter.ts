// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoOrder,
* } from '@/domains/order/entities';
*/

export interface OrderDefaultPresenter {
  id: string;
  clientId: string;
  status: string;
  totalOrder: number;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // entity_included?: Array<EntityIncludedIntoOrder>;
}
