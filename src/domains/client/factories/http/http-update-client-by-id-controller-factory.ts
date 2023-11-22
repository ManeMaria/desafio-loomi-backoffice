import {
  PrismaGetClientByNameRepository,
  PrismaGetClientByIdRepository,
  PrismaUpdateClientRepository,
} from '@/domains/client/infra/prisma/repositories';
import {
  makeUpdateClientValidation,
} from '@/domains/client/interface/validation';
import {
  HttpUpdateClientByIdController,
} from '@/domains/client/interface/http';



export const makeHttpUpdateClientByIdController =
  (): HttpUpdateClientByIdController => {
    const getClientByIdRepository = new PrismaGetClientByIdRepository();
    const getClientByNameRepository = new PrismaGetClientByNameRepository();
    const updateClientByIdRepository = new PrismaUpdateClientRepository();

    const validation = makeUpdateClientValidation();


    return new HttpUpdateClientByIdController(
      getClientByIdRepository,
      getClientByNameRepository,
      updateClientByIdRepository,
      validation,

    );
  };
