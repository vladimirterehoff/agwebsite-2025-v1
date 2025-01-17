// Libs
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
// Redux
import { AppState } from '@/app-redux/state';
import { authActions } from '@/app-redux/auth/actions';
// Utils
import { ADMIN_PATH } from '@/utils/routers/admin';
import { phoneClean } from '@/helpers/phoneClean';
import { SCOPE } from 'utils/config/base';
// Hooks
import { useRequestErrors } from 'hooks/useRequestErrors';
// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// Components
import Loader from '@/components/Common/Loader';
import PhoneNumber from '@/components/Common/FormComponents/PhoneNumber';
// Helpers
import { notify } from 'helpers/notify';
// Styles
import styles from '../style.module.scss';
// Other
import { schema } from './schema';


interface FormValues {
  username: string;
  side: string;
  non_field_error: string;
}

type Props = {
  onSubmitCallback: (phone: string) => void;
}

const PhoneForm = ({onSubmitCallback}: Props) => {
  const [loading, setLoading] = useState(true);
  const { requestError } = useRequestErrors();
  const { loading: authLoading } = useSelector((state: AppState) => state.auth);
  const formHook = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      side: 'backend',
    },
  });
  const { handleSubmit, formState, setError } = formHook;
  const { errors } = formState;

  useEffect(() => {
    setTimeout(() => setLoading(false), 10);
    return () => setLoading(true);
  }, [])

  const onSubmit = async (data: FormValues) => {
    const { non_field_error, username: notCleanPhone, ...formVal } = data;
    const phone = phoneClean(notCleanPhone);
    try {
      await authActions.resetPassEmail({ ...formVal, username: phone, scopes: ['backend'] }, SCOPE.ADMIN);
      notify.success('We have sent the OTP password to your phone!');
      onSubmitCallback(phone);
    } catch (errors: any) {
      requestError(errors, setError);
      errors?.errors?.forEach((error: any) =>
      error.errors.forEach((message: string) => {
        setError(error.field as keyof FormValues, { message });
      }));
    }
  };

  if (authLoading) return <Loader isLoading />
  else return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        <Box>
          <p className={styles.subText}>Please enter your phone number to recover your password.</p>
        </Box>

        {!loading && <Box className="m-t-30">
          <PhoneNumber
            name="username"
            autoComplete="phone"
            label="Phone"
            variant="outlined"
            error={Boolean(errors.username?.message)}
            helperText={errors.username?.message}
            required
          />
        </Box>
}

        {errors['non_field_error'] && (
          <div className="error-text text-left">{errors['non_field_error']?.message}</div>
        )}

        <Box className="m-t-20">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formState.isSubmitting}
            size="large"
          >
            Reset Password
          </Button>
        </Box>

        <Box className="m-t-20 m-b-20">
          <Divider />
        </Box>
        <Link href={ADMIN_PATH.LOGIN}>Back to login</Link>
      </form>
    </FormProvider>
  );
};

export default PhoneForm;
