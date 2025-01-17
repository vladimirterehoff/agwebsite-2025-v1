// Libs
import React, { useState } from 'react';
import Link from 'next/link';
// MUI Components
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Components
import Form from './Components/Form';
import Success from './Components/Success';
// Constants
import {SITE_PATH} from "@/utils/routers/site";
// Styles
import styles from './style.module.scss';

/**
 * Recovery Password Container
 * @constructor
 */
const RecoveryPassword = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);

    return (
        <>
            <div className={styles.form}>
                <Link href={SITE_PATH.SIGN_IN} >
                    <ArrowBackIcon className="backLink"/>
                </Link>

                {!isEmailSent ?
                    <Form submitCallback={()=>setIsEmailSent(true)} /> :
                    <Success onResend={()=>setIsEmailSent(false)}/>
                }

            </div>
        </>
    );
};

export default RecoveryPassword;
