import { NameValidator } from '@/shared/interface/validation/protocols';

import validator from 'validator';

export class ValidatorNameAdapter implements NameValidator {
  validate(name: NameValidator.Params): any {
    if (typeof name !== 'string') return false;

    const nameHasSpaces = validator.contains(name, ' ');

    if (nameHasSpaces) {
      return validator.isAlpha(name.replace(/\s/g, ''), 'pt-BR');
    }

    const nameIsValid = validator.isAlpha(name, 'pt-BR');
    return nameIsValid;
  }
}
