import { Validation } from '@/shared/interface/validation/protocols';

import {
  ValidationComposite,
  RequiredFieldsValidation,
  UuidValidation,
} from '@/shared/interface/validation/validators';

import { ValidatorUuidAdapter } from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['id']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));

export const makeDeleteUserByIdValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
