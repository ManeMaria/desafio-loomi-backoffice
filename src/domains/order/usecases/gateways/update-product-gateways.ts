import { ProductIntoOrderItems } from '@/domains/order/entities';

export interface IUpdateProductGateways {
  update(
    productToUpdate: IUpdateProductGateways.Params,
  ): Promise<IUpdateProductGateways.Result>;
}

export namespace IUpdateProductGateways {
  export type Params = ProductIntoOrderItems;
  export type Result = void;
}
