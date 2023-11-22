import { Client } from '@/domains/client/entities';

export interface IGetClientByIdRepository {
  get(
    id: IGetClientByIdRepository.Params,
  ): Promise<IGetClientByIdRepository.Result>;
}

export namespace IGetClientByIdRepository {
  export type Params = string;
  export type Result = Client | null;
}
