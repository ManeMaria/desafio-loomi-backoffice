import { InvalidParamError } from '@/shared/interface/validation/errors';

import {
  NameValidator,
  Validation,
} from '@/shared/interface/validation/protocols';

export class NameValidation implements Validation {
  private readonly fieldName: string;
  private readonly nameValidator: NameValidator;

  constructor(fieldName: string, nameValidator: NameValidator) {
    this.fieldName = fieldName;
    this.nameValidator = nameValidator;
  }

  validate(input: Validation.Params): Validation.Result {
    if (input[this.fieldName] === undefined) return;
    const isValid = this.nameValidator.validate(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
