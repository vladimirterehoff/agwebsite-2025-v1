// Libs
import React, {useState} from 'react';
import Link from 'next/link';
import {useSelector} from "react-redux";
import {useForm, FormProvider} from "react-hook-form";
// Redux
import {AppState} from "@/app-redux/state";
import {authActions} from "@/app-redux/auth/actions";
// MUI Components
import Box from '@mui/material/Box';
// Components
import Loader from '@/components/Common/Loader';
import Button from '@/components/Common/Button';
import TextField from '@/components/Common/FormComponents/TextField';
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";
// Constants
import {SITE_PATH} from '@/utils/routers/site';
import {SCOPE} from '@/utils/config/base';
// Styles
import styles from './style.module.scss';

interface FormValues {
    email: string;
    password: string;
    non_field_error: string;
}

/**
 * Sign In Container
 * @constructor
 */
const SignInPage = () => {
    const { requestError } = useRequestErrors();
    const { loading } = useSelector((state: AppState) => state.auth);
    const formHook = useForm<FormValues>({});
    const { handleSubmit, formState, setError } = formHook;
    const { errors } = formState;

    /**
     * Submit Sign In Form
     * @param data
     */
    const onSubmit = async (data: FormValues) => {
        const { non_field_error, ...formVal } = data;
        try{
            const response = await authActions.login({...formVal, scopes: [SCOPE.SITE]});
        }
        catch (errors : any) { requestError(errors, setError)}
    };

    return (
        <>
            <div className={styles.form}>
                <h1>Sign In</h1>

                <FormProvider {...formHook}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Loader isLoading={loading} />

                        <Box className="m-t-20">
                            <TextField
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                                name="email"
                                label="Email"
                                type="email"
                            />
                        </Box>

                        <Box className="m-t-20">
                            <TextField
                                error={Boolean(errors.password?.message)}
                                helperText={errors.password?.message}
                                name="password"
                                label="Password"
                                type='password'
                            />
                        </Box>

                        <div  className="m-t-20">
                            <Link href={SITE_PATH.PASSWORD_RECOVERY} legacyBehavior>
                                <a className="link">Forgot password?</a>
                            </Link>
                        </div>

                        {errors['non_field_error'] && (
                            <div className="error-text">{errors['non_field_error']?.message}</div>
                        )}

                        <div className='m-t-20 m-b-20'>
                            <Button type="submit"
                                    disabled={formState.isSubmitting}>
                                Let’s Start
                            </Button>
                        </div>

                    </form>
                </FormProvider>

                <div className="text-center">
                    <p>
                        <small>Not registered yet?</small>
                    </p>
                    <Link href={SITE_PATH.SIGN_UP} legacyBehavior>
                        <a>Sign Up</a>
                    </Link>
                </div>

            </div>
        </>
    );
};

export default SignInPage;
