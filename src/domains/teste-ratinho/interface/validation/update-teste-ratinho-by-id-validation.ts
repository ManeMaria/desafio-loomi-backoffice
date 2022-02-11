import { Validation } from '@/shared/interface/validation/protocols';

import {
  ValidationComposite,
  NameValidation,
  BooleanValidation,
  SomeParamWithoutValidation,
  RequiredFieldsValidation,
  UuidValidation,
} from '@/shared/interface/validation/validators';

import {
  ValidatorNameAdapter,
  ValidatorBooleanAdapter,
  ValidatorUuidAdapter,
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['id']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));
validations.push(new SomeParamWithoutValidation('id'));
validations.push(new NameValidation('name', new ValidatorNameAdapter()));
validations.push(
  new BooleanValidation('enabled', new ValidatorBooleanAdapter())
);

export const makeUpdateTesteRatinhoValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
