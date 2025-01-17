import { string, object } from 'yup';

export const schema = object().shape({
  name1: string().required(),
  name2: string().required(),
  email: string().required().email(),
  password: string().required(),
  description: string().required(),
  editor: string().required(),
  radio: string().required(),
  date_time: string().required(),
  date: string().required(),
  time: string().required(),
});
