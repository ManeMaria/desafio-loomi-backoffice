export interface IDeleteOrderByIdRepository {
  delete(
    id: IDeleteOrderByIdRepository.Params,
  ): Promise<IDeleteOrderByIdRepository.Result>;
}

export namespace IDeleteOrderByIdRepository {
  export type Params = {
    id: string;
    data: {
      enabled: boolean;
    };
  };
  export type Result = void;
}
