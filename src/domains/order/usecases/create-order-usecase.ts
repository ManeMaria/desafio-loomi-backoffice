import {
  Order,
} from '@/domains/order/entities';
import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';



import { IUuidGenerator } from '@/shared/protocols';

export interface ICreateOrderUsecase {
  execute(
    params: ICreateOrderUsecase.Params,
  ): Promise<ICreateOrderUsecase.Response>;
}

export namespace ICreateOrderUsecase {
  export type Params = {
    clientId: string;
    status: string;
    totalOrder: number;
  }

  export type Response = Order;
}

export class CreateOrderUsecase implements ICreateOrderUsecase {


  constructor(
    private readonly saveOrderRepository: ISaveOrderRepository,
    private readonly uuidGenerator: IUuidGenerator,

  ) {

  }

  async execute(
    params: ICreateOrderUsecase.Params,
  ): Promise<ICreateOrderUsecase.Response> {
    console.log({ message: 'Request received', data: params });

    const {
      clientId,
      status,
      totalOrder,

    } = params;


    const id = this.uuidGenerator.generate();

    const order = new Order({
      id,
      clientId,
      status,
      totalOrder
    });

    const orderCreated = await this.saveOrderRepository.save(order);

    console.log({
      message: 'Order created',
      data: orderCreated,
    });

    return orderCreated;
  }
}
