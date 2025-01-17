import { string, object, ref } from 'yup';

export const schema = object().shape({
  token: string().required('OTP is a required field'),
  password: string().required('Password is a required field'),
  password_confirmation: string()
    .required('Confirm password is a required field')
    .oneOf([ref('password')], 'Password must match')
});
