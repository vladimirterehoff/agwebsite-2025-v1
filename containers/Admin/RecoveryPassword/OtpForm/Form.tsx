// Libs
import { useCallback, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
// Redux
import { authActions } from '@/app-redux/auth/actions';
// Helpers
import { notify } from 'helpers/notify';
// Hooks
import { useRequestErrors } from 'hooks/useRequestErrors';
// MUI Components
import { Box, Divider, Typography } from '@mui/material';
// Components
import Button from '@/components/Common/Button';
import Loader from '@/components/Common/Loader';
import ReactHookTextField from '@/components/Common/FormComponents/TextField';
// Utils
import { SCOPE } from 'utils/config/base';
import { ADMIN_PATH } from '@/utils/routers/admin';
// Styles
import styles from '../style.module.scss';
// Other
import { schema } from './schema';

interface FormValues {
  password: string;
  password_confirmation: string;
  token: string;
}

interface Props {
  phone: string;
  goBack: () => void;
}

/**
 * Otp Form
 * @param {Props} props 
 */
const OtpForm = (props: Props) => {
  const { phone, goBack } = props;
  // Hooks
  const formHook = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const { setError, handleSubmit, formState } = formHook;
  const { errors } = formState;
  const { requestError } = useRequestErrors();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const [counter, setCounter] = useState(30);

  const startCounter = () => {
    setCounter(30);
    const start = setInterval(() => {
      setCounter((c) => {
        let newC = c - 1;
        if (newC <= 0) {
          newC = 0;
          clearInterval(start);
        }
        return newC;
      });
    }, 1000);
  };

  useEffect(() => {
    startCounter();
    return () => {
      setCounter(30);
    };
  }, []);

  const resendOtp = async () => {
    try {
      await authActions.resetPassEmail({ username: phone, scopes: ['backend'] }, SCOPE.ADMIN);
      notify.success('We have sent the new OTP password to your phone!');
    } catch (errors) {
      requestError(errors, setError);
    }
    startCounter();
  };

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsLoading(true);
      try {
        await authActions.resetPassUpdate({ ...data, username: phone });
        setIsLoading(false);
        notify.success(
          'Your password has been changed! In 5 seconds you will be redirected to the Sign In page.',
        );
        setTimeout(() => {
          push(ADMIN_PATH.LOGIN);
        }, 5000);
      } catch (errors: any) {
        requestError(errors, setError);
        errors?.errors?.forEach((error: any) =>
          error.errors.forEach((message: string) => {
            setError(error.field as keyof FormValues, { message });
          }),
        );
        setIsLoading(false);
      }
    },
    [push, phone],
  );

  return (
    <>
      <Loader isLoading={isLoading} />
      <p className={styles.subText}>Please enter temporary password that we sent to {phone}:</p>

      <FormProvider {...formHook}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="m-t-20">
            <ReactHookTextField
              error={Boolean(errors.token?.message)}
              helperText={errors.token?.message}
              name="token"
              placeholder="OTP"
              type="password"
              maxLength={6}
              required
            />
          </div>

          <div className={'m-t-20 text-center'}>
            <Button onClick={goBack} variant="outlined" size="large" color={'primary'}>
              Another Phone
            </Button>
          </div>

          <div className={'m-t-20 text-center'}>
            <Typography className={styles.subText}>or</Typography>
          </div>

          <div className={'m-t-20 text-center'}>
            <Button
              onClick={resendOtp}
              disabled={counter !== 0}
              variant="outlined"
              size="large"
              color={'primary'}
            >
              Resend Otp {counter !== 0 ? `in ${counter}` : ''}
            </Button>
          </div>

          <Box className="m-t-20 m-b-20">
            <Divider />
          </Box>

          <div className="m-t-20">
            <ReactHookTextField
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              name="password"
              placeholder="New password"
              type="password"
              required
            />
          </div>

          <div className="m-t-20">
            <ReactHookTextField
              error={Boolean(errors.password_confirmation?.message)}
              helperText={errors.password_confirmation?.message}
              name="password_confirmation"
              placeholder="Confirm password"
              type="password"
              required
            />
          </div>

          <div className={'m-t-20'}>
            <Button
              type="submit"
              size="large"
              fullWidth
              disabled={formState.isSubmitting}
              color={'primary'}
            >
              Send
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default OtpForm;
