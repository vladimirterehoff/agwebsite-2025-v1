// Libs
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link  from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
// Redux
import { AppState } from '@/app-redux/state';
import { profileActions } from '@/app-redux/profile/actions';
import { authActions } from '@/app-redux/auth/actions';
// MUI Components
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// Components
import Loader from '@/components/Common/Loader';
import Button from '@/components/Common/Button';
import TextField from '@/components/Common/FormComponents/TextField';
// Hooks
import { useRequestErrors } from '@/hooks/useRequestErrors';
// Constants
import { SCOPE }  from '@/utils/config/base';
import { ADMIN_MAIN, ADMIN_PATH }  from '@/utils/routers/admin';

interface FormValues {
    username: string;
    password: string;
    non_field_error: string;
}

/**
 * Sign In Container
 * @constructor
 */
const Sign_In = () => {
    const { push } = useRouter();
    const { loading } = useSelector((state: AppState) => state.auth);
    const formHook = useForm<FormValues>({});
    const { handleSubmit, formState, setError, clearErrors } = formHook;
    const { errors } = formState;
    const { requestError } = useRequestErrors();

    /**
     * Submit Sign In Form
     * @param data
     */
    const onSubmit = async (data: FormValues) => {
        const { non_field_error, ...formVal } = data;
        try{
            await authActions.login({...formVal, scopes: [SCOPE.ADMIN]}, SCOPE.ADMIN);
            await profileActions.getProfile('', SCOPE.ADMIN);
            push(ADMIN_PATH.PASSWORD_RECOVERY);
        }
        catch (errors : any) {
            requestError(errors, setError)}
    };

    return (
        <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Loader isLoading={loading} />

                <Box className="m-t-30">
                    <TextField
                        error={Boolean(errors.username?.message)}
                        helperText={errors.username?.message}
                        name="username"
                        label="Email or phone"
                        onChange={() => clearErrors('non_field_error')}
                        // type="email"
                    />
                </Box>

                <Box className="m-t-20">
                    <TextField
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        name="password"
                        label="Password"
                        type='password'
                        onChange={() => clearErrors('non_field_error')}
                    />
                </Box>

                {errors['non_field_error'] && (
                    <div className="error-text text-left">{errors['non_field_error']?.message}</div>
                )}

                <Box className="m-t-20">
                    <Button type="submit"
                            fullWidth={true}
                            disabled={formState.isSubmitting} >
                        Sign In
                    </Button>
                </Box>

                <Box className="m-t-20 m-b-20">
                    <Divider />
                </Box>
                <Link href={ADMIN_PATH.PASSWORD_RECOVERY}>
                    Forgot password
                </Link>
            </form>
        </FormProvider>
    );
};

export default Sign_In;
