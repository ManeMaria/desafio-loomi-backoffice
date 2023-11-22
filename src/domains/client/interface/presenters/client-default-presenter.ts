// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoClient,
* } from '@/domains/client/entities';
*/

export interface ClientDefaultPresenter {
  id: string;
  name: string;
  contact: string;
  address: string;
  enabled?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // association
  // entity_included?: Array<EntityIncludedIntoClient>;
}
