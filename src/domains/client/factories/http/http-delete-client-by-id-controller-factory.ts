import {
  PrismaDeleteClientByIdRepository,
  PrismaGetClientByIdRepository,
} from '@/domains/client/infra/prisma/repositories';
import {
  makeDeleteClientByIdValidation,
} from '@/domains/client/interface/validation';
import {
  HttpDeleteClientByIdController,
} from '@/domains/client/interface/http';



export const makeHttpDeleteClientByIdController =
  (): HttpDeleteClientByIdController => {
    const getClientByIdRepository = new PrismaGetClientByIdRepository();
    const deleteClientByIdRepository = new PrismaDeleteClientByIdRepository();

    const validation = makeDeleteClientByIdValidation();


    return new HttpDeleteClientByIdController(
      getClientByIdRepository,
      deleteClientByIdRepository,
      validation,

    );
  };
