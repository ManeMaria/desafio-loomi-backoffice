import { Validation } from '@/shared/interface/validation/protocols';

import {
  RequiredFieldsValidation,
  ValidationComposite,
  NameValidation
} from '@/shared/interface/validation/validators';

import {
  ValidatorNameAdapter,
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['name', 'contact', 'address']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(new NameValidation('address', new ValidatorNameAdapter()));

export const makeCreateClientValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
