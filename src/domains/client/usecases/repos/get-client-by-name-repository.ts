import { Client } from '@/domains/client/entities';

export interface IGetClientByNameRepository {
  get(
    name: IGetClientByNameRepository.Params,
  ): Promise<IGetClientByNameRepository.Result>;
}

export namespace IGetClientByNameRepository {
  export type Params = string;
  export type Result = Client | null;
}
