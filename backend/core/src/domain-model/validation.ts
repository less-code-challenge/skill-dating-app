export class ValidationError extends Error {
  static NAME = 'ValidationError';

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = ValidationError.NAME;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function assert(attributeName: string | undefined) {
  return {
    of(value: string | undefined) {
      const trimmedValue = value && value.trim();
      return {
        isNotEmpty() {
          if (!trimmedValue) {
            throw new ValidationError(`${attributeName} must not be null`);
          }
          return this;
        },
        isNotLongerThan(maxLength: number) {
          if (trimmedValue && trimmedValue.length > maxLength) {
            throw new ValidationError(`Max length of ${attributeName} is ${maxLength}`);
          }
          return this;
        },
        matches(regExp: RegExp) {
          if (trimmedValue && !regExp.test(trimmedValue)) {
            throw new ValidationError(`${attributeName} does not match ${regExp.source}`);
          }
          return this;
        },
        isOneOf(values: string[]) {
          if (trimmedValue && values.indexOf(trimmedValue) === -1) {
            throw new ValidationError(`${attributeName} is not one of ${values}`);
          }
          return this;
        }
      };
    }
  };
}
