import { IGetOrderByIdRepository } from '@/domains/order/usecases/repos';
import { Order } from '@/domains/order/entities';



export interface IGetOrderByIdUsecase {
  execute(
    id: IGetOrderByIdUsecase.Params
  ): Promise<IGetOrderByIdUsecase.Result>;
}

export namespace IGetOrderByIdUsecase {
  export type Params = string;
  export type Result = Order | null;
}

export class GetOrderByIdUsecase implements IGetOrderByIdUsecase {


  constructor(
    private readonly getOrderByIdRepository: IGetOrderByIdRepository,
  ) {

  }

  async execute(
    id: IGetOrderByIdUsecase.Params,
  ): Promise<IGetOrderByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const orderExists = await this.getOrderByIdRepository.get(id);

    if (!orderExists) return null;

    console.log({
      message: 'Order found',
      data: orderExists,
    });

    return orderExists;
  }
}
