import { describe, it, expect } from 'vitest';
import { getFormFieldError } from './getFormFieldError';

describe('getFormFieldError', () => {
  it('returns the error message for matching field', () => {
    const formErrors = [
      { field: 'name', message: 'Name is required' },
      { field: 'email', message: 'Invalid email' },
    ];

    const result = getFormFieldError('email', formErrors);

    expect(result).toBe('Invalid email');
  });

  it('returns general error when no matching field found', () => {
    const formErrors = [{ field: 'name', message: 'Name is required' }];
    const generalError = 'Something went wrong';

    const result = getFormFieldError('email', formErrors, generalError);

    expect(result).toBe('Something went wrong');
  });

  it('returns empty string when no matching field and no general error', () => {
    const formErrors = [{ field: 'name', message: 'Name is required' }];

    const result = getFormFieldError('email', formErrors);

    expect(result).toBe('');
  });

  it('returns empty string when formErrors is empty array', () => {
    const result = getFormFieldError('email', []);

    expect(result).toBe('');
  });

  it('handles null as generalError', () => {
    const result = getFormFieldError('email', [], null);

    expect(result).toBe('');
  });
});
