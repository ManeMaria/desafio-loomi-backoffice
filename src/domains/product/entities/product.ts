// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoProduct,
* } from '@/domains/product/entities';
*/

export type ProductConstructorParams = {
  id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // inclusionName: Array<EntityIncludedIntoProduct>;
}

export class Product {
  id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // inclusionName: Array<EntityIncludedIntoProduct>;

  constructor(productParams: ProductConstructorParams) {
    const {
      id,
      name,
      enabled,
      createdAt,
      updatedAt,
      description,
      cost,
      quantity,

    } = productParams;

    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.quantity = quantity;
    this.enabled = enabled ?? true;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    // this.inclusionName = inclusionName;

    Object.freeze(this);
  }
}
