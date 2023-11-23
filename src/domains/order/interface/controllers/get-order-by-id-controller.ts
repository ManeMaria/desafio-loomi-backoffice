import {
  GetOrderByIdUsecase,
} from '@/domains/order/usecases';
import {
  IGetOrderByIdRepository,
} from '@/domains/order/usecases/repos';
import {
  OrderDefaultPresenter,
  OrderTransformers,
} from '@/domains/order/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetOrderByIdRequest {
  id: string;
}

export type GetOrderByIdResponse = { order: OrderDefaultPresenter } | null;

export class GetOrderByIdController {
  private usecase: GetOrderByIdUsecase;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetOrderByIdUsecase(
      getOrderByIdRepository,

    );


  }

  async execute(
    request: GetOrderByIdRequest
  ): Promise<GetOrderByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasErrors = this.validation.validate(request);

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const order = await this.usecase.execute(id);

    console.log({
      message: 'Order found',
      data: order,
    });

    if (!order) {
      return null;
    }

    const orderDefaultPresenter =
      OrderTransformers.generateDefaultPresenter(order);

    return { order: orderDefaultPresenter };
  }
}
