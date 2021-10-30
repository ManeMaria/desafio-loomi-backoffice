import { InvalidParamError } from '@/presentation/validation/errors';

import {
  PhoneValidator,
  Validation,
} from '@/presentation/validation/protocols';

export class PhoneValidation implements Validation {
  private readonly fieldName: string;
  private readonly phoneValidator: PhoneValidator;

  constructor(fieldName: string, phoneValidator: PhoneValidator) {
    this.fieldName = fieldName;
    this.phoneValidator = phoneValidator;
  }

  validate(input: Validation.Params): Validation.Result {
    const isValid = this.phoneValidator.validate(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
