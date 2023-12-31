import { Validation } from '@/shared/interface/validation/protocols';

import {
  ValidationComposite,
  NameValidation,
  NumberValidation,
  UuidValidation,
  RangeDateValidation,
  OrderByValidation,
} from '@/shared/interface/validation/validators';

import {
  ValidatorNameAdapter,
  ValidatorNumberAdapter,
  ValidatorUuidAdapter,
  ValidatorDateAdapter,
} from '@/shared/infra/validators';

const validations: Validation[] = [];

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));
validations.push(new NameValidation('name', new ValidatorNameAdapter()));

validations.push(new NumberValidation('take', new ValidatorNumberAdapter()));
validations.push(new NumberValidation('skip', new ValidatorNumberAdapter()));
validations.push(
  new RangeDateValidation('createdAt', new ValidatorDateAdapter())
);
validations.push(
  new RangeDateValidation('updatedAt', new ValidatorDateAdapter())
);
validations.push(new OrderByValidation('orderBy'));

export const makeGetClientsByFilterValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
