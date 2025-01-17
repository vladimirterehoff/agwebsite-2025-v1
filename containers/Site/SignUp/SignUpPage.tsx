// Libs
import React from 'react';
import {useSelector} from "react-redux";
import {FormProvider, useForm} from "react-hook-form";
import Link from "next/link";
import {useRouter} from "next/router";
// Redux
import {AppState} from "@/app-redux/state";
import {authActions} from "@/app-redux/auth/actions";
// MUI Components
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Components
import Loader from '@/components/Common/Loader';
import Button from '@/components/Common/Button';
import TextField from '@/components/Common/FormComponents/TextField';
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";
// Constants
import {SITE_PATH} from "@/utils/routers/site";
import {SCOPE} from "@/utils/config/base";
// Styles
import styles from './style.module.scss';

type FormValues = {
    last_name: string ;
    first_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    scopes: [SCOPE.SITE];
    non_field_error: string;
};

/**
 * Sign UP Container
 * @constructor
 */
const SignUpPage = () => {
    const { loading } = useSelector((state: AppState) => state.profile);
    const { push } = useRouter();
    const { requestError } = useRequestErrors();
    const formHook = useForm<FormValues>({});
    const { register, handleSubmit, control, formState, setError, setValue, reset } = formHook;
    const { errors } = formState;

    /**
     * Submit registration form
     * @param data
     */
    const onSubmit = async (data: FormValues) => {
        const { non_field_error, ...passData } = data;
        passData.scopes = [SCOPE.SITE];
        passData.password_confirmation = passData.password;
        try{
            const response = await authActions.register(passData);
            push(SITE_PATH.EMAIL_VERIFICATION);
        }
        catch (errors : any) {requestError(errors, setError);}
    };

  return (
    <>
      <div className={styles.form}>
        <Loader isLoading={loading} />
        <section>
            <Link href={SITE_PATH.SIGN_IN} >
                <ArrowBackIcon className="backLink"/>
            </Link>
            <h1>
                Sign Up
            </h1>

            <FormProvider {...formHook}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/*First name*/}
                    <div className="m-t-20">
                        <TextField
                            error={Boolean(errors.first_name?.message)}
                            helperText={errors.first_name?.message}
                            name="first_name"
                            label={"First name (required)"}
                        />
                    </div>

                    {/*Last name*/}
                    <div className="m-t-20">
                        <TextField
                            error={Boolean(errors.last_name?.message)}
                            helperText={errors.last_name?.message}
                            name="last_name"
                            label={"Last name (required)"}
                        />
                    </div>

                    {/*Email*/}
                    <div className="m-t-20">
                        <TextField
                            error={Boolean(errors.email?.message)}
                            helperText={errors.email?.message}
                            name="email"
                            label={"Email (required)"}
                            type="email"
                        />
                    </div>

                    {/*Password*/}
                    <div className="m-t-20">
                        <TextField
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                            name="password"
                            label="Password (required)"
                            type='password'
                        />
                    </div>

                    <div className="m-t-20 m-b-20">
                        <p>
                            <small>By clicking on this button you agree to the</small>
                        </p>
                        <Link href={SITE_PATH.TERMS_OF_USE} legacyBehavior>
                            <a target="_blank" className="linkBlue ttn">
                                <small>Terms and Conditions</small>
                            </a>
                        </Link>
                    </div>

                    <Button type="submit" fullWidth disabled={formState.isSubmitting} color={'primary'}>
                        Next
                    </Button>
                    {errors['non_field_error'] && (
                        <div className="error-text m-t-5">{errors['non_field_error']?.message}</div>
                    )}

                    <Box className="m-t-20">
                        <div>
                            <p>
                                <small>Already have an account? </small>
                            </p>
                            <Link href={SITE_PATH.SIGN_IN} legacyBehavior>
                                <a>Sign In</a>
                            </Link>
                        </div>
                    </Box>
                </form>
            </FormProvider>
        </section>
      </div>
    </>
  );
};

export default SignUpPage;
