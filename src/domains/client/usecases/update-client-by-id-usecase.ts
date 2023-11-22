import {
  IGetClientByIdRepository,
  IGetClientByNameRepository,
  IUpdateClientRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientNotFoundException,
  ClientAlreadyExistsException,
} from '@/domains/client/usecases/exceptions';
import {
  Client,
} from '@/domains/client/entities';



export interface IUpdateClientByIdUsecase {
  execute(
    updateParams: IUpdateClientByIdUsecase.Params,
  ): Promise<IUpdateClientByIdUsecase.Result>;
}

export namespace IUpdateClientByIdUsecase {
  export type Params = {
    id: string;
    paramsToUpdate: {
      name?: string;
      contact?: string;
      address?: string;
      enabled?: boolean;
    };
  };
  export type Result = Client;
}

export class UpdateClientByIdUsecase implements IUpdateClientByIdUsecase {


  constructor(
    private readonly getClientByIdRepository: IGetClientByIdRepository,
    private readonly getClientByNameRepository: IGetClientByNameRepository,
    private readonly updateClientRepository: IUpdateClientRepository,

  ) {

  }

  async execute(
    updateParams: IUpdateClientByIdUsecase.Params,
  ): Promise<IUpdateClientByIdUsecase.Result> {
    console.log({ message: 'Request received', data: updateParams });

    const { id, paramsToUpdate } = updateParams;

    const clientExists = await this.getClientByIdRepository.get(id);

    if (!clientExists) {
      console.log({
        message: 'Client found',
        data: updateParams,
      });

      throw new ClientNotFoundException({ id });
    }

    console.log({
      message: 'Client found',
      data: clientExists,
    });

    const clientToUpdate = new Client({
      ...clientExists,
      ...paramsToUpdate,
    });

    if (paramsToUpdate.name) {
      const isClient = await this.getClientByNameRepository.get(
        paramsToUpdate.name
      );

      if (isClient && isClient.id !== id) {
        console.log({
          message: 'Client already exist',
          data: isClient,
        });

        throw new ClientAlreadyExistsException({
          name: clientToUpdate.name,
        });
      }
    }

    const clientUpdated = await this.updateClientRepository.update(
      clientToUpdate,
    );

    console.log({
      message: 'Client updated',
      data: clientUpdated,
    });

    return clientUpdated;
  }
}
