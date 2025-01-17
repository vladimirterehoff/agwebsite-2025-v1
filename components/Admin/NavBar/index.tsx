// Libs
import React, { useEffect, ReactNode } from 'react';
import { useRouter } from "next/router";
import {useSelector} from "react-redux";
import PerfectScrollbar from 'react-perfect-scrollbar';
// Redux
import { AppState } from '@/app-redux/state';
// MUI Components
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
// Components
import NavItem from './NavItem';
// Constants
import { ADMIN_MENU, Item } from "./menu";
import { ADMIN_MAIN } from "@/utils/routers/admin";
// Styles
import styles from './style.module.scss';
import {Role} from "@/app-redux/users/model";
import {useRoles} from "@/hooks/useRoles";

interface NavBarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

function renderNavItems({
  items,
  roles,
  depth = 0
}: {
  items: Item[];
  roles: Role[];
  depth?: number;
}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc : any[], item : Item) => reduceChildRoutes({ acc, item, depth, roles }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  item,
  depth,
  roles
}: {
  acc: any[];
  item: Item;
  depth: number;
  roles: Role[];
}) {
  const router = useRouter();
  const key = item.title + depth;

  if (item?.showFor === undefined || (item?.showFor && roles?.find((role) => item.showFor?.includes(role.slug)))) {
    if (item.items) {
      let open = false;
      item.items.forEach((e)=>{
        if(e.href!='' && router.pathname.indexOf(e.href)>=0) open = true;
      })

      acc.push(
        <NavItem
          depth={depth}
          href={item.href}
          icon={item.icon}
          info={item.info}
          key={key}
          open={open}
          title={item.title}
        >
          {renderNavItems({
            depth: depth + 1,
            roles,
            items: item.items
          })}
        </NavItem>
      );
    } else {
      let open = false;
      if(item.href!=ADMIN_MAIN && router.pathname.indexOf(item.href)>=0) open = true;
      if(item.href == ADMIN_MAIN && router.pathname  + '/' ==item.href) open = true;

      acc.push(
        <NavItem
          depth={depth}
          href={item.href}
          icon={item.icon}
          info={item.info}
          open={open}
          key={key}
          title={item.title}
        />
      );
    }
  }

  return acc;
}

const NavBar = (props: NavBarProps) => {
  const { onMobileClose, openMobile } = props

  const {profile} = useSelector((state: AppState) => state.profile);
  const roles = useRoles();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, []);

  const content = (
    <Box
      height="100%"
      className = {styles.navigation}
      display="flex"
      flexDirection="column"
    >
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          {/* <Box
            p={2}
            display="flex"
            justifyContent="center"
          >
            <Link href={ADMIN_MAIN}>
              <img src={'/logo.svg'} />
            </Link>
          </Box> */}
        </Hidden>
        {profile && (
          <Box p={2} className={styles.nav_profile}>
            {/*<Box
              display="flex"
              justifyContent="center"
            >
              <Avatar
                alt="User"
                className = {styles.avatar}
                src={profile.avatar}
              />
            </Box>*/}
            <Box>
              <Typography
                variant="h6"
                className={'ellipsis'}
                color="textPrimary"
              >
                {profile?.first_name} {profile?.last_name}
              </Typography>

              <Typography
                variant="body2"
                className={'ellipsis'}
                color="textSecondary"
              >
                {profile.email}
              </Typography>
            </Box>
          </Box>
        )}
        <Divider />
        <Box p={2}>
            <List>
              {renderNavItems({
                items: ADMIN_MENU,
                roles
              })}
            </List>
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: styles.mobile_drawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: styles.desktop_drawer  }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
