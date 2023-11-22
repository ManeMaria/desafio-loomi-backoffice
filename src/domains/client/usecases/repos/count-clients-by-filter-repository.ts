import { ClientFilters } from '@/domains/client/usecases';

export interface ICountClientsByFilterRepository {
  count(
    filters: ICountClientsByFilterRepository.Params,
  ): Promise<ICountClientsByFilterRepository.Result>;
}

export namespace ICountClientsByFilterRepository {
  export type Params = ClientFilters['filters'];
  export type Result = number;
}
