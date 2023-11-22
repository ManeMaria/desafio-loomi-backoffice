import {
  IGetClientByIdRepository,
  IDeleteClientByIdRepository,
} from '@/domains/client/usecases/repos';
import {
  ClientNotFoundException,
} from '@/domains/client/usecases/exceptions';



export interface IDeleteClientByIdUsecase {
  execute(
    id: IDeleteClientByIdUsecase.Params
  ): Promise<IDeleteClientByIdUsecase.Result>;
}

export namespace IDeleteClientByIdUsecase {
  export type Params = string;
  export type Result = void;
}

export class DeleteClientByIdUsecase implements IDeleteClientByIdUsecase {


  constructor(
    private readonly getClientByIdRepository: IGetClientByIdRepository,
    private readonly deleteClientByIdRepository: IDeleteClientByIdRepository,

  ) {

  }

  async execute(
    id: IDeleteClientByIdUsecase.Params,
  ): Promise<IDeleteClientByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const clientExists = await this.getClientByIdRepository.get(id);

    if (!clientExists) {
      throw new ClientNotFoundException({ id });
    }

    console.log({
      message: 'Client found',
      data: clientExists,
    });

    await this.deleteClientByIdRepository.delete({
      id,
      data: {
        enabled: false,
      }
    });

    console.log({ message: 'Client deleted', data: { id } });
  }
}
