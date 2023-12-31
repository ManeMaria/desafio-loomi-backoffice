import { Validation } from '@/shared/interface/validation/protocols';

import {
  ValidationComposite,
  NameValidation,
  RequiredFieldsValidation,
  UuidValidation,
} from '@/shared/interface/validation/validators';

import {
  ValidatorNameAdapter,
  ValidatorUuidAdapter,
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['id']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));
validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(new NameValidation('address', new ValidatorNameAdapter()));

export const makeUpdateClientValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
