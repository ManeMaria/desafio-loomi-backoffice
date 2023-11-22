import { Client } from '@/domains/client/entities';
import {
  ClientDefaultPresenter,
} from '@/domains/client/interface/presenters';

export class ClientTransformers {
  static generateDefaultPresenter(client: Client): ClientDefaultPresenter {
    return {
      id: client.id,
      name: client.name,
      contact: client.contact,
      address: client.address,
      enabled: client.enabled,
      created_at: client.createdAt,
      updated_at: client.updatedAt,

      // association
      // inclusion_name: client.entityIncluded,
    };
  }
}
