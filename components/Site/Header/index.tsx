// Libs
import React, { memo } from 'react';
import Link from 'next/link';
import {useSelector} from "react-redux";
// Redux
import { AppState } from '@/app-redux/state';
// MUI Components
import {useTheme} from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
// Components
import { default as Menu } from './Menu';
import { default as MobileMenu } from './MobileMenu';
import LangSwitcher from "@/components/Common/Lang/LangSwitcher";
// Constants
import {SITE_PATH} from '@/utils/routers/site';
import {TITLE} from "@/utils/constants";
// Styles
import styles from './style.module.scss';

interface Props{
    activeMenuId?: string | number
}

/**
 * Header Component
 * @param props
 * @constructor
 */
const Header = (props: Props) => {
    const {profile} = useSelector((state: AppState) => state.profile);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

    return (
        <header className={styles.header}>
            <div className={styles.content}>

                {/*MOBILE MENU*/}
                {isMobile &&  <MobileMenu />}

                {/*LOGO*/}
                <Link href="/" legacyBehavior>
                    <a className={styles.logo}>
                        <img src={'/logo.svg'} alt={TITLE} />
                    </a>
                </Link>

                {/*DESKTOP MENU*/}
                {!isMobile && <Menu activeMenuId={props.activeMenuId}/>}

                <div>
                    {/*LANG SWITCHER*/}
                    <LangSwitcher />

                    {/*PROFILE MENU*/}
                    {profile ? (
                        <Link href={SITE_PATH.ACCOUNT} legacyBehavior>
                            <a className="header_btn"> <span>Account</span></a>
                        </Link>
                    ):(
                        <Link href={SITE_PATH.SIGN_IN} legacyBehavior>
                            <a className="header_btn"> <span>Sign In</span></a>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
