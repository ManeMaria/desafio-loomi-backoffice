import { InvalidParamError } from '@/presentation/validation/errors';

import {
  EmailValidator,
  Validation,
} from '@/presentation/validation/protocols';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input: Validation.Params): Validation.Result {
    const isValid = this.emailValidator.validate(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
