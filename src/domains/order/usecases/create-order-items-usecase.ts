import {
  OrderItems,
} from '@/domains/order/entities';
import {
  ISaveOrderItemsRepository,
} from '@/domains/order/usecases/repos';

import { IUuidGenerator } from '@/shared/protocols';

export interface ICreateOrderItemsUsecase {
  execute(
    params: ICreateOrderItemsUsecase.Params,
  ): Promise<ICreateOrderItemsUsecase.Response>;
}

export namespace ICreateOrderItemsUsecase {
  export type Params = {
    quantity: number;
    costPerItem: number; // product.price
    subTotal: number; // costPerItem x quantity
    createdAt?: Date;
    updatedAt?: Date;
    // association
    orderId: string;
    productId: string;
  }[];

  export type Response = OrderItems[];
}

export class CreateOrderItemsUsecase implements ICreateOrderItemsUsecase {

  constructor(
    private readonly saveOrderItemsRepository: ISaveOrderItemsRepository,
    private readonly uuidGenerator: IUuidGenerator,

  ) {

  }

  async execute(
    params: ICreateOrderItemsUsecase.Params,
  ): Promise<ICreateOrderItemsUsecase.Response> {
    console.log({ message: 'Request received', data: params });

    const orderItems = await Promise.all(this.setIdsInOrderItems(params));

    const orderItemsCreated = await this.saveOrderItemsRepository.save(orderItems);

    console.log({
      message: 'OrderItems created',
      data: orderItemsCreated,
    });

    return orderItems;
  }


  private setIdsInOrderItems(orderItems: ICreateOrderItemsUsecase.Params) {
    return orderItems.map(async (orderItem) => {
      const item = new OrderItems({
        ...orderItem,
        id: this.uuidGenerator.generate(),
      })

      return item;
    });
  }
}
