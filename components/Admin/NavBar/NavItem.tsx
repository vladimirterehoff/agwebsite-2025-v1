// Libs
import React, { useState, ReactNode } from 'react';
import  Link  from 'next/link';
// MUI Components
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// Styles
import styles from './style.module.scss';
import CounterNumber from '../CounterNumber';
import { AppState } from '@/app-redux/state';
import { useSelector } from 'react-redux';

interface NavItemProps {
  children?: ReactNode;
  className?: string;
  depth: number;
  href: any ;
  icon?: any;
  info?: any;
  open?: boolean;
  title: string;
}

const NavItem = (props: NavItemProps) => {
  const {
    children,
    className,
    depth,
    href,
    icon: Icon,
    info: Info,
    open: openProp,
    title
  } = props;

  const {refundableNumber} = useSelector((state: AppState) => state.orders);

  const [open, setOpen] = useState<boolean>(!!openProp);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };

  if (children) {
    return (
      <ListItem
        className={`${styles.item} ${className}`}
        disableGutters
        key={title}
      >
        <Button
          className={styles.button}
          onClick={handleToggle}
          style={style}
        >
          {Icon && (
            <Icon
              className={styles.icon}
              size="20"
            />
          )}
          <span className={styles.title}>
            {title}
          </span>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={open}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem
      className={`${styles.itemLeaf} ${className}`}
      disableGutters
      key={title}
    >
      <Link  href={href}>
        <Button
          className={`${styles.buttonLeaf} depth-${depth} ${open? styles.active : ''}`}
        >
          {Icon && (
            <Icon
              className={styles.icon}
              size="20"
            />
          )}
          <span className={styles.title}>
          {title}
        </span>
          {title === 'Orders' ? <CounterNumber number={refundableNumber} /> : null}
          {Info && <Info />}
        </Button>
      </Link>
    </ListItem>
  );
};

NavItem.defaultProps = {
  open: false
};

export default NavItem;
