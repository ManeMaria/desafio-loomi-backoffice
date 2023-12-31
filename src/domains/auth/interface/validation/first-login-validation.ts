import { Validation } from '@/shared/interface/validation/protocols';

import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
} from '@/shared/interface/validation/validators';

import { ValidatorEmailAdapter } from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['email', 'newPassword', 'temporaryPassword']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new EmailValidation('email', new ValidatorEmailAdapter()));

export const makeFirstLoginValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
