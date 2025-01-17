// Libs
import React, {ReactNode} from 'react';
// Components
import HeadMeta from '@/components/Site/HeadMeta';
// Styles
import styles from './style.module.scss';

interface Props {
    meta? : {
        title? : string,
        description? : string,
        image? : string,
        schemaOrg? : object[]
    },
    children : ReactNode
}

/**
 * Site Layout Component
 * @param props
 * @constructor
 */
const Layout= (props: Props) => {
    return (
        <>
            <HeadMeta {...props.meta}/>

            <div className={styles.wrapper}>
                {props.children}
            </div>
        </>
    );
};

export default Layout;
