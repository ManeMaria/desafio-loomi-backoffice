export interface IDeleteClientByIdRepository {
  delete(
    id: IDeleteClientByIdRepository.Params,
  ): Promise<IDeleteClientByIdRepository.Result>;
}

export namespace IDeleteClientByIdRepository {
  export type Params = {
    id: string;
    data: {
      enabled: boolean;
    }
  };
  export type Result = void;
}
