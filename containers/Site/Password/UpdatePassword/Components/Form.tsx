// Libs
import React, {useCallback, useState} from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
// Redux
import {authActions} from "@/app-redux/auth/actions";
// MUI Components
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Components
import Button from '@/components/Common/Button';
import TextField from '@/components/Common/FormComponents/TextField';
import Loader from "@/components/Common/Loader";
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";
// Constants
import {SITE_PATH} from "@/utils/routers/site";

interface FormValues {
  password: string;
  password_confirmation: string;
}

interface Props {
  submitCallback: () => void
}

/**
 * Update Password Form
 * @param props
 * @constructor
 */
const Form = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { setError, handleSubmit, formState } = formHook;
  const { errors } = formState;
  const {requestError} = useRequestErrors();
  const { push, query } = useRouter();

    /**
     * Submit form - create new password
     */
  const onSubmit =  useCallback(
      async (data: FormValues) => {
        try{
          const response = await authActions.resetPassUpdate(
              { ...data, email: query.email as string, token: query.w_token as string });
          props.submitCallback();
          setTimeout(() => {
            push(SITE_PATH.SIGN_IN);
          }, 5000);
        }
        catch (errors : any) {
          requestError(errors, setError);
        }
      },
      [push, query.email, query.w_token],
  );

  return (
    <>
      <Loader isLoading={formState.isSubmitting} />

      <Link href={SITE_PATH.SIGN_IN} >
        <ArrowBackIcon className="backLink"/>
      </Link>

      <h1>Create new password</h1>
      <p>At least 8 characters</p>

        <FormProvider {...formHook}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="m-t-20">
              <TextField
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                name="password"
                placeholder="New password"
                type='password'
              />
            </div>

            <div className="m-t-20">
              <TextField
                error={Boolean(errors.password_confirmation?.message)}
                helperText={errors.password_confirmation?.message}
                name="password_confirmation"
                placeholder="Confirm password"
                type='password'
              />
            </div>

            <div className={'m-t-20'}>
              <Button type="submit"
                      disabled={formState.isSubmitting}>
                Send
              </Button>
            </div>

          </form>
        </FormProvider>
    </>
  );
};

export default Form;