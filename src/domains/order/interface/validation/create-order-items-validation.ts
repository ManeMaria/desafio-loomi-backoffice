import { Validation } from '@/shared/interface/validation/protocols';

import {
  RequiredFieldsValidation,
  ValidationComposite,
  NumberValidation,
  UuidValidation
} from '@/shared/interface/validation/validators';

import {
  ValidatorNumberAdapter,
  ValidatorUuidAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['quantity', 'costPerItem', 'productId']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('productId', new ValidatorUuidAdapter()));
validations.push(new NumberValidation('quantity', new ValidatorNumberAdapter()));
validations.push(new NumberValidation('costPerItem', new ValidatorNumberAdapter()));

export const makeCreateOrderItemsValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
