import {
  PrismaGetClientByNameRepository,
  PrismaSaveClientRepository,
} from '@/domains/client/infra/prisma/repositories';
import {
  makeCreateClientValidation,
} from '@/domains/client/interface/validation';
import {
  HttpCreateClientController,
} from '@/domains/client/interface/http';


import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';

export const makeHttpCreateClientController = (): HttpCreateClientController => {
  const getClientByNameRepository = new PrismaGetClientByNameRepository();
  const saveClientRepository = new PrismaSaveClientRepository();

  const uuidGenerator = new UUIDGeneratorAdapter();
  const validation = makeCreateClientValidation();


  return new HttpCreateClientController(
      getClientByNameRepository,
      saveClientRepository,
      uuidGenerator,
      validation,

  );
};
