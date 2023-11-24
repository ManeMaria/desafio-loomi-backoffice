
export interface IGetProductByIdGateways {
  get(
    id: IGetProductByIdGateways.Params,
  ): Promise<IGetProductByIdGateways.Result>;
}

export namespace IGetProductByIdGateways {
  export type Params = string;
  export type Result = {
    quantity: number;
  } | null;
}
