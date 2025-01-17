import { ReactNode } from 'react';
import styles from './style.module.scss';

interface Props {
  children: ReactNode;
}

const FormButtonsWrap = (props: Props) => (
  <div className={styles.buttonsWrap}>{props.children}</div>);

export default FormButtonsWrap;
