// Libs
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import {useForm, FormProvider} from "react-hook-form";
// Redux
import { AppState } from "@/app-redux/state";
import { authActions} from "@/app-redux/auth/actions";
import { profileActions} from "@/app-redux/profile/actions";
// Components
import Loader from "@/components/Common/Loader";
import Button from "@/components/Common/Button";
import TextField from "@/components/Common/FormComponents/TextField";
import Timer from "@/components/Common/Timer";
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";
// Helpers
import { FilterService } from "@/helpers/filterService";
import { notify } from "@/helpers/notify";
// Constants
import {SITE_PATH} from "@/utils/routers/site";

type FormValues = {
  email: string;
  token: string;
  non_field_error: string;
};

/**
 * Email Verification Container
 * @constructor
 */
const EmailVerification = () => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState, setError } = formHook;
  const { errors } = formState;
  const {profile, loading} = useSelector((state: AppState) => state.profile);
  const {query, push} = useRouter();
  const {requestError} = useRequestErrors();

  useEffect(() => {
    if(query.w_token){
      onSubmit({
        email : '',
        token : '',
        non_field_error : '',
      });
    }
  }, [query.email, query.w_token]);

  /**
   * Submit verification
   * @param data
   */
  const onSubmit = async (data: FormValues) => {
    const { non_field_error, ...passData } = data;
    let email : any = query.email? query.email : profile? profile.email : '';
    let token : any = query.w_token? query.w_token : data.token? data.token : '';
    passData.email = email;
    passData.token = token;

    try{
      const filter = new FilterService();
      const response = await authActions.verificationEmail(passData);
      await profileActions.getProfile(filter.filter);
      notify.success('Success');
      push(SITE_PATH.ACCOUNT)
    }
    catch (errors : any) {
      handleErrors(errors)
    }
  };

  /**
   * Resend link with token to the email
   */
  const onResend = async () => {
    let email : any = query.email? query.email : profile? profile.email : '';
    try{
      const response = await authActions.resendVerificationEmail({
        email: email,
        side : 'frontend'
      });
      notify.success('A message will be sent')
    }
    catch (errors : any) {
      handleErrors(errors);
    }
  };

  const handleErrors = (errors : any) => {
    const allErrors: string[]=[];
    errors.errors && errors.errors.forEach((error:any) =>
        error.errors.forEach((message:string) => {
          allErrors.push(message)
        }),
    );
    notify.error(allErrors.join(' '));
  }

  if(!query.w_token) {
    return (
        <section>
          <Loader isLoading={loading} />

          <h1>
            A message will be sent to that address containing a Code to unlock your account.
          </h1>

          <p className="m-t-10">
            If you do not receive your email within five minutes check your spam folder.
          </p>

          <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="m-t-20 m-b-20">
                <TextField
                    error={Boolean(errors.token?.message)}
                    helperText={errors.token?.message}
                    name="token"
                    label={'Code'}
                />
              </div>

              <Button type="submit" fullWidth disabled={formState.isSubmitting} color={'primary'}>
                Next
              </Button>

              <div className="m-t-20">
                <Timer handleCallback={onResend}/>
              </div>

              {errors['non_field_error'] && (
                  <div className="error-text m-t-10 ">{errors['non_field_error']?.message}</div>
              )}
            </form>
          </FormProvider>
        </section>
    )
  } else {
    return (
        <section>
          <h4>Verification in process...</h4>
        </section>
    );
  }
};

export default EmailVerification;
