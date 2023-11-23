// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoProduct,
* } from '@/domains/product/entities';
*/

export interface ProductDefaultPresenter {
  id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // entity_included?: Array<EntityIncludedIntoProduct>;
}
