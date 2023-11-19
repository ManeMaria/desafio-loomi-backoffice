import { DateFilter } from '@/shared/helpers';

export interface ICountUsersByFilterRepository {
  count(
    filter: ICountUsersByFilterRepository.Params
  ): Promise<ICountUsersByFilterRepository.Result>;
}

export namespace ICountUsersByFilterRepository {
  export type Params = {
    name?: string;
    email?: string;
    type?: string;
    enabled?: boolean;
    createdAt?: DateFilter;
    updatedAt?: DateFilter;
  };
  export type Result = number;
}
