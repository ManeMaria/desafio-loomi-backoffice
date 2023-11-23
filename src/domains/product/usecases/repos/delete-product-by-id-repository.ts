export interface IDeleteProductByIdRepository {
  delete(
    id: IDeleteProductByIdRepository.Params,
  ): Promise<IDeleteProductByIdRepository.Result>;
}

export namespace IDeleteProductByIdRepository {
  export type Params = {
    id: string;
    data: {
      enabled: boolean;
    }
  };
  export type Result = void;
}
