// Libs
import React, {memo, useEffect} from 'react';
import Link from 'next/link';
// Styles
import styles from './style.module.scss';

interface menuItem {
  title : string,
  link : string,
  id? : string | number,
}

interface Props{
  activeMenuId?: string | number | undefined
}

/**
 * Desktop Menu Component
 * @param props
 * @constructor
 */
const Menu = (props: Props) => {
  const list : menuItem[] =  [
    {id: 0, title : 'Menu 1', link : ''},
    {id: 1, title : 'Menu 2', link : ''},
    {id: 2, title : 'Menu 3', link : ''},
  ] ;

  return (
    <>
      <nav className={styles.navigation}>
        <ul>
          {list && list.map((item, index) => (
            <li key={index}>
              <Link href={item.link} legacyBehavior>
                <a className={item.id && props.activeMenuId == item.id ? 'active' : ''}>
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );

};

export default Menu;
