import { Validation } from '@/shared/interface/validation/protocols';
import { OrderStatus } from '@/domains/order/entities';

import {
  RequiredFieldsValidation,
  ValidationComposite,
  EnumFieldValidation,
  UuidValidation,
  NumberValidation

} from '@/shared/interface/validation/validators';

import {
  ValidatorUuidAdapter,
  ValidatorNumberAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['status', 'totalOrder', 'clientId']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new EnumFieldValidation('status', Object.values(OrderStatus)));
validations.push(new UuidValidation('clientId', new ValidatorUuidAdapter()));
validations.push(new NumberValidation('totalOrder', new ValidatorNumberAdapter()))

export const makeCreateOrderValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
