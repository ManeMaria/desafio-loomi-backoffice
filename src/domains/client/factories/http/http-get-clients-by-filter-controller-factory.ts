import {
  PrismaGetClientsByFilterRepository,
  PrismaCountClientsByFilterRepository,
} from '@/domains/client/infra/prisma/repositories';
import {
  makeGetClientsByFilterValidation,
} from '@/domains/client/interface/validation';
import {
  HttpGetClientsByFilterController,
} from '@/domains/client/interface/http';



export const makeHttpGetClientsByFilterController =
  (): HttpGetClientsByFilterController => {
    const getClientsByFilterRepository = new PrismaGetClientsByFilterRepository();
    const countClientsByFilterRepository = new PrismaCountClientsByFilterRepository();
    const validation = makeGetClientsByFilterValidation();


    return new HttpGetClientsByFilterController(
      getClientsByFilterRepository,
      countClientsByFilterRepository,
      validation,

    );
  };
