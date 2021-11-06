import validator from 'validator';

import { RgValidator } from '@/presentation/validation/protocols';

export class ValidatorRgAdapter implements RgValidator {
  validate(rg: RgValidator.Params): RgValidator.Result {
    const replacedRg = rg.replace(/(\.|-)/g, '');

    const isNumeric = validator.isNumeric(replacedRg);
    return isNumeric;
  }
}
