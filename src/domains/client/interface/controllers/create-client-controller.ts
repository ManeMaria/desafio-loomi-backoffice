import {
  CreateClientUsecase,
} from '@/domains/client/usecases';
import {
  ISaveClientRepository,
  IGetClientByNameRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientDefaultPresenter,
  ClientTransformers,
} from '@/domains/client/interface/presenters';

import { ValidationException } from '@/shared/helpers';
import { IUuidGenerator } from '@/shared/protocols';
import { Validation } from '@/shared/interface/validation/protocols';

export interface CreateClientRequest {
  name: string;
  contact: string;
  address: string;
}

export type CreateClientResponse = ClientDefaultPresenter;

export class CreateClientController {
  private usecase: CreateClientUsecase;


  constructor(
    getClientByNameRepository: IGetClientByNameRepository,
    saveClientRepository: ISaveClientRepository,
    uuidGenerator: IUuidGenerator,
    private readonly validation: Validation,

  ) {
    this.usecase = new CreateClientUsecase(
      getClientByNameRepository,
      saveClientRepository,
      uuidGenerator,
    );


  }

  async execute(
    request: CreateClientRequest
  ): Promise<CreateClientResponse> {

    const { name, address, contact } = request;

    const hasError = this.validation.validate({
      name, address, contact
    });

    if (hasError) {

      throw new ValidationException(hasError);
    }

    console.log({ message: 'Params validated' });

    const clientCreated = await this.usecase.execute({ name, address, contact });

    const clientCreatedPresenter =
      ClientTransformers.generateDefaultPresenter(clientCreated);

    console.log({
      message: 'Client created',
      data: clientCreatedPresenter,
    });

    return clientCreatedPresenter;
  }
}
