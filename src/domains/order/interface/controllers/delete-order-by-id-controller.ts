import {
  DeleteOrderByIdUsecase,
} from '@/domains/order/usecases';
import {
  IGetOrderByIdRepository,
  IDeleteOrderByIdRepository,
} from '@/domains/order/usecases/repos';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface DeleteOrderByIdRequest {
  id: string;
}

export type DeleteOrderByIdResponse = void;

export class DeleteOrderByIdController {
  private usecase: DeleteOrderByIdUsecase;


  constructor(
    getOrderByIdRepository: IGetOrderByIdRepository,
    deleteOrderByIdRepository: IDeleteOrderByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new DeleteOrderByIdUsecase(
      getOrderByIdRepository,
      deleteOrderByIdRepository,

    );


  }

  async execute(
    request: DeleteOrderByIdRequest,
  ): Promise<DeleteOrderByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasError = this.validation.validate({ id });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    await this.usecase.execute(id);

    console.log({ message: 'Order deleted', data: { id } });
  }
}
