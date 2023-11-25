import { Validation } from '@/shared/interface/validation/protocols';

import {
  ValidationComposite,
  DateValidation
} from '@/shared/interface/validation/validators';

import {
  ValidatorDateAdapter
} from '@/shared/infra/validators';

const validations: Validation[] = [];


validations.push(new DateValidation('initialDate', new ValidatorDateAdapter()));
validations.push(new DateValidation('finalDate', new ValidatorDateAdapter()));


export const makeGetReportByFilterValidation = (): ValidationComposite => {
  return new ValidationComposite(validations);
};
