import {
  PrismaGetClientByIdRepository,
} from '@/domains/client/infra/prisma/repositories';
import {
  makeGetClientByIdValidation,
} from '@/domains/client/interface/validation';
import {
  HttpGetClientByIdController,
} from '@/domains/client/interface/http';



export const makeHttpGetClientByIdController = (): HttpGetClientByIdController => {
  const getClientByIdRepository = new PrismaGetClientByIdRepository();
  const validation = makeGetClientByIdValidation();


  return new HttpGetClientByIdController(
    getClientByIdRepository,
    validation,

  );
};
