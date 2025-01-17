// Libs
import React, {ReactNode} from 'react';
// Styles
import styles from './style.module.scss';

interface Props {
    className?: string;
    children?: ReactNode
}

/**
 * Main Wrapper Component
 * @param props
 * @constructor
 */
const Main = (props: Props) => {

    return (
        <main className={`${styles.main} ${ props.className}`}>
            {props.children}
        </main>
    );
};

export default Main;

