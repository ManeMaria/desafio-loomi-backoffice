import { Validation } from '@/shared/interface/validation/protocols';
import { OrderStatus } from '@/domains/order/entities';

import {
  RequiredFieldsValidation,
  ValidationComposite,
  EnumFieldValidation,
  UuidValidation

} from '@/shared/interface/validation/validators';

import {
  ValidatorUuidAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['status', 'clientId']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new EnumFieldValidation('status', Object.values(OrderStatus)));
validations.push(new UuidValidation('clientId', new ValidatorUuidAdapter()));

export const makeCreateOrderValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
