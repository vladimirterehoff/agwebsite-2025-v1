// Libs
import React, { memo } from 'react';
import Link from 'next/link';
// MUI Components
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
// Components
import Button from '@/components/Common/Button';
// Hooks
import { useDevice } from '@/hooks/useDevice';
// Constants
import {TITLE} from "@/utils/constants";
// Styles
import styles from './style.module.scss';

interface menuItem {
    title : string,
    link : string
}

/**
 * Footer Component
 * @constructor
 */
const Footer = () => {
    const year  = new Date().getFullYear();
    const currentDevice = useDevice();

    const list : menuItem[] =  [
        {title : 'Menu 1', link : ''},
        {title : 'Menu 2', link : ''},
        {title : 'Menu 3', link : ''},
    ] ;

    return (
        <footer  className={styles.footer}>
            <div className={`${styles.content} ${styles.footer_top}`}>
                {/*LOGO*/}
                <Link href="/" >
                    <img src={'/logo.svg'} alt={TITLE} />
                </Link>

                {/*MENU*/}
                <div className={styles.navigation}>
                    <ul>
                        {list &&
                        list.map((item, index) => (
                            <li key={index}>
                                <Link href={item.link} legacyBehavior>
                                    <a>{item.title}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/*SOCIAL BUTTONS*/}
                <div>
                    { (!currentDevice.isMobile() || currentDevice.isIos()) && (
                        <Link href={'APP_STORE_LINK'}>
                            <Button className={styles.app_links_btn}><AppleIcon/> App Store</Button>
                        </Link>
                    )}
                    <br/>
                    {(!currentDevice.isMobile() || currentDevice.isAndroid()) && (
                        <Link href={'GOOGLE_PLAY_LINK'}>
                            <Button className={styles.app_links_btn}><AndroidIcon/> Android</Button>
                        </Link>
                    )}

                </div>
            </div>


            {/*COPYRIGHT*/}
            <div className={styles.copyright}>
                <div className={`${styles.content} ${styles.copyright_content}`}>
                    <div>Copyright © {year} {TITLE} <br/> All rights reserved</div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
