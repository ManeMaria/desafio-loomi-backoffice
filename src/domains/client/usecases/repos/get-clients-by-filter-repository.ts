import { ClientFilters } from '@/domains/client/usecases';
import { Client } from '@/domains/client/entities';

export interface IGetClientsByFilterRepository {
  get(
    params: IGetClientsByFilterRepository.Params,
  ): Promise<IGetClientsByFilterRepository.Result>;
}

export namespace IGetClientsByFilterRepository {
  export type Params = ClientFilters;
  export type Result = Array<Client>;
}
