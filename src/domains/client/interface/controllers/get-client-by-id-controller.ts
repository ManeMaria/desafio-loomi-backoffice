import {
  GetClientByIdUsecase,
} from '@/domains/client/usecases';
import {
  IGetClientByIdRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientDefaultPresenter,
  ClientTransformers,
} from '@/domains/client/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface GetClientByIdRequest {
  id: string;
}

export type GetClientByIdResponse = { client: ClientDefaultPresenter } | null;

export class GetClientByIdController {
  private usecase: GetClientByIdUsecase;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new GetClientByIdUsecase(
      getClientByIdRepository,

    );


  }

  async execute(
    request: GetClientByIdRequest
  ): Promise<GetClientByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id } = request;

    const hasErrors = this.validation.validate({ id });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const client = await this.usecase.execute(id);

    console.log({
      message: 'Client found',
      data: client,
    });

    if (!client) {
      return null;
    }

    const clientDefaultPresenter =
      ClientTransformers.generateDefaultPresenter(client);

    return { client: clientDefaultPresenter };
  }
}
