// Libs
import React, {memo} from 'react';
import Link from 'next/link';
// MUI Components
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
// Styles
import styles from './style.module.scss';

interface menuItem {
  title : string,
  link : string,
  id? : string,
}

/**
 * Mobile Menu Component
 * @constructor
 */
const MobileMenu = () => {
  const [open, setOpen] = React.useState(false);

  const list : menuItem[] =  [
    {title : 'Menu 1', link : ''},
    {title : 'Menu 2', link : ''},
    {title : 'Menu 3', link : ''},
  ] ;


  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        onClick={handleToggle}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        anchor={'left'}
        open={open}
        onClose={()=>setOpen(false)}
      >
        <IconButton onClick={()=>setOpen(false)}
                    className={styles.navigation_mobile_close}><CloseIcon /></IconButton>

        <div className={styles.navigation_mobile}>
          {list &&
          list.map((item, index) => (
            <Link href={item.link} legacyBehavior>
              <a onClick={handleToggle}>{item.title}</a>
            </Link>
          ))}
        </div>
      </Drawer>
    </>
  );

};

export default memo(MobileMenu);
