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
  ValidatorNumberAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['id']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));
validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(new NameValidation('description', new ValidatorNameAdapter()));
validations.push(new NameValidation('cost', new ValidatorNumberAdapter()));
validations.push(new NameValidation('quantity', new ValidatorNumberAdapter()));

export const makeUpdateProductValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
