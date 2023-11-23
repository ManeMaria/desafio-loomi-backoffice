import { Validation } from '@/shared/interface/validation/protocols';
import { OrderStatus } from '@/domains/order/entities';
import {
  ValidationComposite,
  RequiredFieldsValidation,
  UuidValidation,
  EnumFieldValidation,
  NumberValidation,
} from '@/shared/interface/validation/validators';

import {
  ValidatorNumberAdapter,
  ValidatorUuidAdapter,
} from '@/shared/infra/validators';

const validations: Validation[] = [];

for (const field of ['id']) {
  validations.push(new RequiredFieldsValidation(field));
}

validations.push(new UuidValidation('id', new ValidatorUuidAdapter()));
validations.push(new EnumFieldValidation('status', Object.values(OrderStatus)));
validations.push(new UuidValidation('clientId', new ValidatorUuidAdapter()));
validations.push(new NumberValidation('totalOrder', new ValidatorNumberAdapter()))

export const makeUpdateOrderValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
