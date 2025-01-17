// Libs
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
// Redux
import {authActions} from "@/app-redux/auth/actions";
// MUI Components
import Box from '@mui/material/Box';
// Components
import Button from '@/components/Common/Button';
import TextField from '@/components/Common/FormComponents/TextField';
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";

interface FormValues {
  email: string;
}

interface Props {
  submitCallback: () => void;
}

/**
 * Recovery Password Form
 * @param props
 * @constructor
 */
const Form = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState, setError } = formHook;
  const { errors } = formState;
  const {requestError} = useRequestErrors();

  /**
   * Submit Form - Send link for update password to the email
   * @param data
   */
  const onSubmit = async (data: FormValues) => {
    try{
      const response = await  authActions.resetPassEmail(data);
      props.submitCallback();
    }
    catch (errors : any) {
      requestError(errors, setError);
    }
  };

  return (
    <>
      <h1>Password recover</h1>
      <p>
        We will send you an email with further instructions
      </p>
      <FormProvider {...formHook}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box className="m-t-20">
            <TextField
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              name="email"
              placeholder="Email"
              type="email"
            />
          </Box>

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
