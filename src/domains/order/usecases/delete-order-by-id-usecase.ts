import {
  IGetOrderByIdRepository,
  IDeleteOrderByIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderNotFoundException,
} from '@/domains/order/usecases/exceptions';



export interface IDeleteOrderByIdUsecase {
  execute(
    id: IDeleteOrderByIdUsecase.Params
  ): Promise<IDeleteOrderByIdUsecase.Result>;
}

export namespace IDeleteOrderByIdUsecase {
  export type Params = string;
  export type Result = void;
}

export class DeleteOrderByIdUsecase implements IDeleteOrderByIdUsecase {


  constructor(
    private readonly getOrderByIdRepository: IGetOrderByIdRepository,
    private readonly deleteOrderByIdRepository: IDeleteOrderByIdRepository,

  ) {

  }

  async execute(
    id: IDeleteOrderByIdUsecase.Params,
  ): Promise<IDeleteOrderByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const orderExists = await this.getOrderByIdRepository.get(id);

    if (!orderExists) {
      throw new OrderNotFoundException({ id });
    }

    console.log({
      message: 'Order found',
      data: orderExists,
    });

    await this.deleteOrderByIdRepository.delete({
      id,
      data: {
        enabled: false,
      }
    });

    console.log({ message: 'Order deleted', data: { id } });
  }
}
