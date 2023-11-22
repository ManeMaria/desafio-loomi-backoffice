import { Client } from '@/domains/client/entities';

export interface ISaveClientRepository {
  save(
    clientParams: ISaveClientRepository.Params,
  ): Promise<ISaveClientRepository.Result>;
}

export namespace ISaveClientRepository {
  export type Params = Client;
  export type Result = Client;
}
