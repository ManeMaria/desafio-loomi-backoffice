import {
  DeleteOrderItemsByIdUsecase,
} from '@/domains/order/usecases';
import {
  IGetOrderItemsByOrderIdRepository,
  IDeleteOrderItemsByOrderIdRepository
} from '@/domains/order/usecases/repos';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface DeleteOrderItemsByOrderIdRequest {
  id: string;
}

export type DeleteOrderItemsByOrderIdResponse = void;

export class DeleteOrderItemsByOrderIdController {
  private usecase: DeleteOrderItemsByIdUsecase;


  constructor(
    getOrderItemsByOrderIdRepository: IGetOrderItemsByOrderIdRepository,
    deleteOrderItemsOrderByIdRepository: IDeleteOrderItemsByOrderIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new DeleteOrderItemsByIdUsecase(
      getOrderItemsByOrderIdRepository,
      deleteOrderItemsOrderByIdRepository,

    );


  }

  async execute(
    request: DeleteOrderItemsByOrderIdRequest,
  ): Promise<DeleteOrderItemsByOrderIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasError = this.validation.validate({ id });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    await this.usecase.execute(id);

    console.log({ message: 'OrderItems deleted', data: { id } });
  }
}
