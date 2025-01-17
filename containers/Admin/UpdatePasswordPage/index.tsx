import React, { useState } from 'react';
import Form from './Components/Form';
import Success from './Components/Success';
import styles from './style.module.scss';

const UpdatePasswordPage = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);

    return (
        <>
            <div className={styles.form}>

                <div style={{display: !isEmailSent ? 'block' : 'none' }}>
                    <Form submitCallback={()=>setIsEmailSent(true)} />
                </div>

                {isEmailSent && (
                    <Success />
                )}

            </div>
        </>
    );
};

export default UpdatePasswordPage;
