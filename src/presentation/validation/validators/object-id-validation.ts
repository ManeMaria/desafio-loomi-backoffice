import { InvalidParamError } from '@/presentation/validation/errors';
import {
  ObjectIdValidator,
  Validation,
} from '@/presentation/validation/protocols';

export class ObjectIdValidation implements Validation {
  private readonly fieldName: string;
  private readonly objectIdValidator: ObjectIdValidator;

  constructor(fieldName: string, objectIdValidator: ObjectIdValidator) {
    this.fieldName = fieldName;
    this.objectIdValidator = objectIdValidator;
  }

  validate(input: Validation.Params): Validation.Result {
    const isValid = this.objectIdValidator.validate(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}