// Libs
import React, { useEffect } from 'react';
// Components
import Button from '@/components/Common/Button';
// Constants
import {TITLE}  from '@/utils/constants';
// Styles
import style  from './style.module.scss';

interface Props {
    statusCode:number
}

/**
 * Error Page Container (404, 500, 403 )
 * @param props
 * @constructor
 */
const ErrorPage = (props : Props) => {
    return (
        <>
            <div className={style.error_content} style={{paddingTop:100, paddingBottom:100, textAlign : 'center'}}>

                <div className={style.error_logo}>
                    <a  href={'/'}>
                        {TITLE}
                    </a>
                </div>

                <div  className={style.error_text}>
                    {props.statusCode == 404 ? (
                        <h1>Page not found :(</h1>
                    ) : props.statusCode == 403 ? (
                        <h1>No permissions  :(</h1>
                    ) :(
                        <h1>Oops... Something went wrong  :(</h1>
                    )}
                </div>

                <a href={'/'}>
                    <Button>Home Page</Button>
                </a>
            </div>
        </>
    );
};

export default ErrorPage;
