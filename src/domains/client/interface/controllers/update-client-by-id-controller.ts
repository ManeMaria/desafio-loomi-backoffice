import {
  UpdateClientByIdUsecase,
} from '@/domains/client/usecases';
import {
  IGetClientByIdRepository,
  IUpdateClientRepository,
  IGetClientByNameRepository,
} from '@/domains/client/usecases/repos';

import {
  ClientDefaultPresenter,
  ClientTransformers,
} from '@/domains/client/interface/presenters';


import { ValidationException } from '@/shared/helpers';
import { Validation } from '@/shared/interface/validation/protocols';

export interface UpdateClientByIdRequest {
  id: string;
  paramsToUpdate: {
    name?: string;
    contact?: string;
    address?: string;

  };
}

export type UpdateClientByIdResponse = ClientDefaultPresenter;

export class UpdateClientByIdController {
  private usecase: UpdateClientByIdUsecase;


  constructor(
    getClientByIdRepository: IGetClientByIdRepository,
    getClientByNameRepository: IGetClientByNameRepository,
    updateClientRepository: IUpdateClientRepository,
    private readonly validation: Validation,

  ) {
    this.usecase = new UpdateClientByIdUsecase(
      getClientByIdRepository,
      getClientByNameRepository,
      updateClientRepository,

    );


  }

  async execute(
    request: UpdateClientByIdRequest,
  ): Promise<UpdateClientByIdResponse> {
    console.log({ message: 'Request received', data: request });

    const { id, paramsToUpdate: {
      name,
      contact,
      address,
    }
    } = request;


    const hasErrors = this.validation.validate({
      id,
      name,
      contact,
      address,
    });

    if (hasErrors) {
      throw new ValidationException(hasErrors);
    }

    console.log({ message: 'Params validated' });

    const clientUpdated = await this.usecase.execute({
      id,
      paramsToUpdate: {
        name,
        contact,
        address,
      },
    });

    const clientUpdatedPresenter =
      ClientTransformers.generateDefaultPresenter(clientUpdated);

    console.log({
      message: 'Client updated',
      data: clientUpdatedPresenter,
    });

    return clientUpdatedPresenter;
  }
}
