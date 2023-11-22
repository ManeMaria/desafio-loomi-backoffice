import {
  Client,
} from '@/domains/client/entities';
import {
  IGetClientByNameRepository,
  ISaveClientRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientAlreadyExistsException,
} from '@/domains/client/usecases/exceptions';

import { IUuidGenerator } from '@/shared/protocols';

export interface ICreateClientUsecase {
  execute(
    params: ICreateClientUsecase.Params,
  ): Promise<ICreateClientUsecase.Response>;
}

export namespace ICreateClientUsecase {
  export type Params = {
    name: string;
    contact: string;
    address: string;
  };

  export type Response = Client;
}

export class CreateClientUsecase implements ICreateClientUsecase {


  constructor(
    private readonly getClientByNameRepository: IGetClientByNameRepository,
    private readonly saveClientRepository: ISaveClientRepository,
    private readonly uuidGenerator: IUuidGenerator,

  ) {

  }

  async execute(
    params: ICreateClientUsecase.Params,
  ): Promise<ICreateClientUsecase.Response> {
    console.log({ message: 'Request received', data: params });



    const clientExists = await this.getClientByNameRepository.get(params.name);

    if (clientExists) {
      console.log({
        message: 'Client already exist',
        data: clientExists,
      });

      throw new ClientAlreadyExistsException({ name: params.name });
    }

    const id = this.uuidGenerator.generate();

    const client = new Client({ id, ...params });

    const clientCreated = await this.saveClientRepository.save(client);

    console.log({
      message: 'Client created',
      data: clientCreated,
    });

    return clientCreated;
  }
}
