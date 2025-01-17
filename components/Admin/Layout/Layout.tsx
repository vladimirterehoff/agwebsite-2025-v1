// Libs
import React, {useState, ReactNode} from 'react';
// MUI Components
import Container from "@mui/material/Container";
// Components
import HeadMeta from "@/components/Admin/HeadMeta";
import TopBar from "@/components/Admin/TopBar";
import NavBar from "@/components/Admin/NavBar";
// Styles
import styles from './style.module.scss';

interface Props {
  children?: ReactNode
}

/**
 * Admin Layout Component
 * @param props
 * @constructor
 */
const Index = (props: Props) => {
  const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  return (
    <>
      <HeadMeta />

      <div className={styles.root}>
        <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <NavBar
          onMobileClose={() => setMobileNavOpen(false)}
          openMobile={isMobileNavOpen}
        />
        <div className={styles.wrapper}>
          <div className={styles.content_container}>
            <div className={styles.content}>
                <div className={styles.page}>
                  <Container maxWidth={false}>
                    <div>
                      {props.children}
                    </div>
                  </Container>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
