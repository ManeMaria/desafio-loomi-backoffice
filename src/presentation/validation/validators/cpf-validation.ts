import { InvalidParamError } from '@/presentation/validation/errors';

import { CpfValidator, Validation } from '@/presentation/validation/protocols';

export class CpfValidation implements Validation {
  private readonly fieldName: string;
  private readonly cpfValidator: CpfValidator;

  constructor(fieldName: string, cpfValidator: CpfValidator) {
    this.fieldName = fieldName;
    this.cpfValidator = cpfValidator;
  }

  validate(input: Validation.Params): Validation.Result {
    const isValid = this.cpfValidator.validate(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
