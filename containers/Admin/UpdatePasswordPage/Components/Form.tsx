// Libs
import React, {useCallback, useState} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';
import {useRouter} from "next/router";
// Redux
import { authActions } from '@/app-redux/auth/actions';
// MUI Components
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Components
import Loader from '@/components/Common/Loader';
import ReactHookTextField from '@/components/Common/FormComponents/TextField';
import Button from '@/components/Common/Button';
// Hooks
import {useRequestErrors} from "hooks/useRequestErrors";
// Utils
import { ADMIN_PATH } from '@/utils/routers/admin';
// Other
import { schema } from './schema';

interface FormValues {
  password: string;
  password_confirmation: string;
}

interface Props {
  submitCallback: () => void
}

/**
 * Form Updata Password
 * @param props 
 */
const Form = (props: Props) => {
  const formHook = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const { setError, handleSubmit, control, formState } = formHook;
  const { errors }  = formState;
  const {requestError} = useRequestErrors();
  const [isLoading, setIsLoading] = useState(false);
  const { push, query } = useRouter();

  const onSubmit =  useCallback(
      async (data: FormValues) => {
        setIsLoading(true);
        try{
          await authActions.resetPassUpdate(
              { ...data, email: query.email as string, token: query.w_token as string });
          setIsLoading(false);
          props.submitCallback();
          setTimeout(() => {
            push(ADMIN_PATH.LOGIN);
          }, 5000);
        }
        catch (errors : any) {
          requestError(errors, setError);
          setIsLoading(false);
        }
      },
      [push, query.email, query.w_token],
  );

  return (
    <>
      <Loader isLoading={isLoading} />

      <Link href={ADMIN_PATH.LOGIN} >
        <ArrowBackIcon className="backLink"/>
      </Link>

      <h1>Recover Password</h1>
      <p>Please enter temporary password that we sent to:</p>

        <FormProvider {...formHook}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="m-t-20">
              <ReactHookTextField
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                name="token"
                placeholder="OTP"
                type='password'
                maxLength={4}
              />
            </div>

            <div className="m-t-20">
              <ReactHookTextField
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                name="password"
                placeholder="New password"
                type='password'
              />
            </div>

            <div className="m-t-20">
              <ReactHookTextField
                error={Boolean(errors.password_confirmation?.message)}
                helperText={errors.password_confirmation?.message}
                name="password_confirmation"
                placeholder="Confirm password"
                type='password'
              />
            </div>

            <div className={'m-t-20'}>
              <Button type="submit" fullWidth disabled={formState.isSubmitting} color={'primary'}>
                Send
              </Button>
            </div>

          </form>
        </FormProvider>
    </>
  );
};

export default Form;