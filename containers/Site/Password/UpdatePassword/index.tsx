// Libs
import React, { useCallback, useState } from 'react';
// Components
import Form from './Components/Form';
import Success from './Components/Success';
// Styles
import styles from './style.module.scss';

/**
 * Update Password Container
 * @constructor
 */
const UpdatePassword = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);

    return (
        <>
            <div className={styles.form}>

                {!isEmailSent ?
                    <Form submitCallback={()=>setIsEmailSent(true)} /> :
                    <Success />
                }

            </div>
        </>
    );
};

export default UpdatePassword;
