import {
  DeleteClientByIdUsecase,
} from '@/domains/client/usecases';
import {
  IGetClientByIdRepository,
  IDeleteClientByIdRepository,
} from '@/domains/client/usecases/repos';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface DeleteClientByIdRequest {
  id: string;
}

export type DeleteClientByIdResponse = void;

export class DeleteClientByIdController {
  private usecase: DeleteClientByIdUsecase;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    deleteClientByIdRepository: IDeleteClientByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new DeleteClientByIdUsecase(
      getClientByIdRepository,
      deleteClientByIdRepository,

    );


  }

  async execute(
    request: DeleteClientByIdRequest,
  ): Promise<DeleteClientByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasError = this.validation.validate({ id });

    if (hasError) {
      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    await this.usecase.execute(id);

    console.log({ message: 'Client deleted', data: { id } });
  }
}
