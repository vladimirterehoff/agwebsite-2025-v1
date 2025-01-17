import { string, object, ref } from 'yup';

export const schema = object().shape({
  password: string().required(),
  password_confirmation: string()
    .required('Confirm password is a required field')
    .oneOf([ref('password')], 'Password must match')
});
