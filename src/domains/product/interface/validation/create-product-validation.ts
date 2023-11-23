import { Validation } from '@/shared/interface/validation/protocols';

import {
  RequiredFieldsValidation,
  ValidationComposite,
  NameValidation
} from '@/shared/interface/validation/validators';

import {
  ValidatorNameAdapter,
  ValidatorNumberAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['name', 'description', 'cost', 'quantity']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(new NameValidation('description', new ValidatorNameAdapter()));
validations.push(new NameValidation('cost', new ValidatorNumberAdapter()));
validations.push(new NameValidation('quantity', new ValidatorNumberAdapter()));

export const makeCreateProductValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
