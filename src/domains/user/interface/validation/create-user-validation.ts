import { Validation } from '@/shared/interface/validation/protocols';

import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
  NameValidation,
  StringLengthValidation,
  EnumFieldValidation,
} from '@/shared/interface/validation/validators';

import {
  ValidatorEmailAdapter,
  ValidatorNameAdapter,
  ValidatorStringLengthAdapter,
} from '@/shared/infra/validators';
import { UserTypeEnum } from '@/domains/user/entities';

const validations: Validation[] = [];

for (const field of ['name', 'email', 'type']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new EmailValidation('email', new ValidatorEmailAdapter()));
validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(
  new EnumFieldValidation('type', Object.values(UserTypeEnum))
);
validations.push(
  new StringLengthValidation('name', new ValidatorStringLengthAdapter(50))
);

export const makeCreateUserValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
