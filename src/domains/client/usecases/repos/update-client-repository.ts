import { Client } from '@/domains/client/entities';

export interface IUpdateClientRepository {
  update(
    clientToUpdate: IUpdateClientRepository.Params,
  ): Promise<IUpdateClientRepository.Result>;
}

export namespace IUpdateClientRepository {
  export type Params = Client;
  export type Result = Client;
}
