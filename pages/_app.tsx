// Libs
import React, { useEffect, Fragment } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import {useRouter} from "next/router";
import { useSelector } from 'react-redux';
// Redux
import { wrapper } from '@/app-redux/config';
import { ordersActions } from '@/app-redux/orders/actions';
import { AppState } from '@/app-redux/state';
// MUI Components
import { ThemeProvider } from '@mui/material/styles';
// Helpers
import {Notify} from '@/helpers/notify';
// Constants
import {TITLE} from '@/utils/constants';
import { ADMIN_MAIN } from '@/utils/routers/admin';
// Styles
import theme from '@/theme';
import 'styles/global.scss';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const { push, asPath } = useRouter();
  const { profile } = useSelector((state: AppState) => state.profile);

  useEffect(() => {
    if (!asPath.includes(ADMIN_MAIN)) push(ADMIN_MAIN);

    // Remove the server-side injected CSS.
    const jssStyles : any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (profile) ordersActions.getRefundableNumber();
  }, [profile]);

  return (
    <>
      <Fragment>
        <Head>
          <title>{TITLE}</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <Notify />
          <Component {...pageProps} />
        </ThemeProvider>
      </Fragment>
    </>
  )
};

export default wrapper.withRedux(appWithTranslation(App));