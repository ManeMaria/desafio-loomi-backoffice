import { IGetClientByIdRepository } from '@/domains/client/usecases/repos';
import { Client } from '@/domains/client/entities';



export interface IGetClientByIdUsecase {
  execute(
    id: IGetClientByIdUsecase.Params
  ): Promise<IGetClientByIdUsecase.Result>;
}

export namespace IGetClientByIdUsecase {
  export type Params = string;
  export type Result = Client | null;
}

export class GetClientByIdUsecase implements IGetClientByIdUsecase {


  constructor(
    private readonly getClientByIdRepository: IGetClientByIdRepository,

  ) {

  }

  async execute(
    id: IGetClientByIdUsecase.Params,
  ): Promise<IGetClientByIdUsecase.Result> {
    console.log({ message: 'Request received', data: { id } });

    const clientExists = await this.getClientByIdRepository.get(id);

    if (!clientExists) return null;

    console.log({
      message: 'Client found',
      data: clientExists,
    });

    return clientExists;
  }
}
