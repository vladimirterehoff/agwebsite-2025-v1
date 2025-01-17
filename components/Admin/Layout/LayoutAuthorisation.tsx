// Libs
import React, {ReactNode} from 'react';
import  Link  from 'next/link';
// MUI Components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// Components
import HeadMeta from "@/components/Admin/HeadMeta";
// Styles
import styles from './style.module.scss';

interface Props {
  children?: ReactNode;
  title: string;
  title_sub_text? : string;
}

/**
 * Admin Layout Component for Authorization Pages
 * @param props
 * @constructor
 */
const Index = (props: Props) => {
  return (
    <>
      <HeadMeta />

      <div className={styles.root}>
        <div className={styles.content_container}>
          <div className={styles.content}>

            <Container
              className={styles.card_container}
              maxWidth="sm"
            >
              <Box
                mb={8}
                display="flex"
                justifyContent="center"
              >
                <Link href="/">
                  <img src={'/logo.svg'} />
                </Link>
              </Box>
              <Card>
                <CardContent className={`${styles.card_content}`}>
                  <div>
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="h4"
                    >
                      {props.title}
                    </Typography>
                  </div>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    {props.title_sub_text}
                  </Typography>
                  <div>
                    <div className={styles.authorize_block}>
                      {props.children}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
