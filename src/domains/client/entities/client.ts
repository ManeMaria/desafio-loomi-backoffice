// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoClient,
* } from '@/domains/client/entities';
*/

export type ClientConstructorParams = {
  id: string;
  name: string;
  contact: string;
  address: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // inclusionName: Array<EntityIncludedIntoClient>;
}

export class Client {
  id: string;
  name: string;
  contact: string;
  address: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  // inclusionName: Array<EntityIncludedIntoClient>;

  constructor(clientParams: ClientConstructorParams) {
    const {
      id,
      name,
      contact,
      address,
      enabled,
      createdAt,
      updatedAt,

      // association
      // inclusionName,
    } = clientParams;

    this.id = id;
    this.name = name;
    this.contact = contact;
    this.address = address;
    this.enabled = enabled ?? true;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    // this.inclusionName = inclusionName;

    Object.freeze(this);
  }
}
