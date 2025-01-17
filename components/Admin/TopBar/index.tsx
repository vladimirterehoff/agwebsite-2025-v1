// Libs
import React from 'react';
import Link  from 'next/link';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
// Redux
import {authActions} from "@/app-redux/auth/actions";
import { AppState } from '@/app-redux/state';
// MUI Components
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import SvgIcon from "@mui/material/SvgIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
// Constants
import {SCOPE} from "@/utils/config/base";
import {ADMIN_MAIN} from "@/utils/routers/admin";
// Styles
import theme from "@/theme";
import styles from './style.module.scss';

interface TopBarProps {
  onMobileNavOpen?: () => void;
}

/**
 * Top Bar Component
 * @param props
 * @constructor
 */
const TopBar = (props: TopBarProps) => {
  const {push} = useRouter();
  const {profile} = useSelector((state: AppState) => state.profile);

  const {
    onMobileNavOpen,
  } = props;

  const isMacbook = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Logout action
   */
  const handleLogout = async (): Promise<void> => {
    await authActions.logout(SCOPE.ADMIN);
  };

  return (
    <AppBar className={styles.topbar}>
      <Toolbar className={styles.toolbar}>
        {isMacbook ?  (
          <>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen? onMobileNavOpen : ()=>{}}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Link href={ADMIN_MAIN} style={{ margin: "0 auto" }}>
          <img className={styles.headerLogo} src={"/logo_white.svg"} />
        </Link>
          </>
          ) : (
          <Link href={ADMIN_MAIN}>
            <img className={styles.headerLogo} src={'/logo_white.svg'} />
          </Link>
        )}

        {profile &&
            <IconButton onClick={()=>handleLogout()}>
              <LogoutIcon style={{color: 'white'}}/>
            </IconButton>
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
