import { makeGetTestsByFilterValidation } from '@/domains/test'
import { Validation } from '@/shared/interface/validation/protocols';
import {
  ValidationComposite,
  UuidValidation,
  BooleanValidation,
  NumberValidation,
  RangeDateValidation,
  OrderByValidation,
} from '@/shared/interface/validation/validators';
import {
  UuidValidatorSpy,
  BooleanValidatorSpy,
  NumberValidatorSpy,
  DateValidatorSpy,
} from '@/tests/shared/validation/mocks';

jest.mock('@/shared/interface/validation/validators/validation-composite');

describe('Get Test by Filter Validation Factory', () => {
  it('should call validation composite with all validations', () => {
    makeGetTestsByFilterValidation();

    const validations: Validation[] = [];

    validations.push(new UuidValidation('id', new UuidValidatorSpy()))
    validations.push(new BooleanValidation('enabled', new BooleanValidatorSpy));
    validations.push(new NumberValidation('take', new NumberValidatorSpy()));
    validations.push(new NumberValidation('skip', new NumberValidatorSpy()));
    validations.push(
      new RangeDateValidation('createdAt', new DateValidatorSpy()),
    );
    validations.push(
      new RangeDateValidation('updatedAt', new DateValidatorSpy()),
    );
    validations.push(new OrderByValidation('orderBy'));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
