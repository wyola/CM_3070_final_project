export const getFormFieldError = (
  fieldName: string,
  formErrors: Array<{ field: string; message: string }>,
  generalError?: string | null
): string => {
  const fieldError = formErrors.find(
    (error) => error.field === fieldName
  )?.message;
  return fieldError || generalError || '';
};
