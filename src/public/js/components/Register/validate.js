export default function validate(values) {
  const errors = {};
  const MIN_PWD_LEN = 6;
  const MAX_PWD_LEN = 32;

  if (!values.firstName) {
    errors.firstName = 'Required';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address!';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (
    values.password.length < MIN_PWD_LEN ||
    values.password.length > MAX_PWD_LEN
  ) {
    errors.password = 'Invalid password. Must be between 6 to 32 characters!';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Must be same as Password';
  }

  return errors;
}
