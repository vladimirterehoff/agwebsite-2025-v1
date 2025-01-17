import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

/**
 * Notify message object
 * @constructor
 */
const Notify = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover/>
    );
};

export default Notify;