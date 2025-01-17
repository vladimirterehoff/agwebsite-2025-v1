// Libs
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import {useRouter} from "next/router";
import {useForm, FormProvider} from "react-hook-form";
// Redux
import { AppState } from "@/app-redux/state";
import {profileActions} from "@/app-redux/profile/actions";
// MUI Components
import Box from "@mui/material/Box";
// Components
import Loader from "@/components/Common/Loader";
import Button from "@/components/Common/Button";
import TextField from "@/components/Common/FormComponents/TextField";
// Hooks
import {useRequestErrors} from "@/hooks/useRequestErrors";
// Constants
import { SITE_PATH} from "@/utils/routers/site";

interface FormValues {
    password: string;
    password_confirmation: string;
    non_field_error: string;
}

/**
 * Change Password Container
 * @constructor
 */
const AccountChangePasswordPage = () => {
    const {profile} = useSelector((state: AppState) => state.profile);
    const { loading } = useSelector((state: AppState) => state.profile);
    const { push } = useRouter();
    const formHook = useForm<FormValues>({});
    const { handleSubmit, formState, setError } = formHook;
    const { errors } = formState;
    const { requestError } = useRequestErrors();

    /**
     * Submit Change Password Form
     * @param data
     */
    const onSubmit = async (data: FormValues) => {
        const { non_field_error, ...formVal } = data;
        try{
            await profileActions.updateProfile({...formVal});
            push(SITE_PATH.ACCOUNT);
        }
        catch (errors : any) {
            requestError(errors);
        }
    };

    return (
        <>
            <div className="account-container">
                <div className="account-panel panel">
                    {profile && (
                        <div className="account-manage-form__container">

                            <div className="account-manage-form__content">
                                <h1>
                                    Create new password
                                </h1>
                                <div className="subheader">
                                    At least 8 characters
                                </div>

                                <FormProvider {...formHook}>
                                    <form onSubmit={handleSubmit(onSubmit)} className="sign-in__form" noValidate>
                                        <Loader isLoading={loading} />

                                        <Box className="form-control">
                                            <TextField
                                                error={Boolean(errors.password?.message)}
                                                helperText={errors.password?.message}
                                                name="password"
                                                label="New Password"
                                                type='password'
                                            />
                                        </Box>

                                        <Box className="form-control">
                                            <TextField
                                                error={Boolean(errors.password_confirmation?.message)}
                                                helperText={errors.password_confirmation?.message}
                                                name="password_confirmation"
                                                label="Confirm Password"
                                                type='password'
                                            />
                                        </Box>

                                        {errors['non_field_error'] && (
                                            <div className="error-text">{errors['non_field_error']?.message}</div>
                                        )}

                                        <Button type="submit"
                                                disabled={formState.isSubmitting}>
                                            Save
                                        </Button>

                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountChangePasswordPage;
