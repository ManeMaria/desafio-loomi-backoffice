export interface IDeleteOrderItemsByOrderIdRepository {
  delete(
    id: IDeleteOrderItemsByOrderIdRepository.Params,
  ): Promise<IDeleteOrderItemsByOrderIdRepository.Result>;
}

export namespace IDeleteOrderItemsByOrderIdRepository {
  export type Params = string;
  export type Result = void;
}
