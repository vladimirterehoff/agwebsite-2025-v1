// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import RecoveryPassword from '@/containers/Site/Password/RecoveryPassword';
// Components
import Layout from '@/components/Site/Layout';
import Footer from '@/components/Site/Footer';
import Main from '@/components/Site/Main';
import Header from '@/components/Site/Header';
import BreadCrumbs from '@/components/Common/BreadCrumbs';
// HOC
import Authorize from "@/hoc/site/Authorize";
// SSR
import {SiteServerSideProps} from "@/ssr/site";
// Constants
import { SITE_PATH } from '@/utils/routers/site';

const Content = Authorize(RecoveryPassword);
const ResetPassword: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Main className={'content'}>
        <BreadCrumbs
          className="breadcrumbs"
          items={[
            { url: '/', text: 'Main' },
            { url: SITE_PATH.SIGN_IN, text: 'Sign In' },
            { url: null, text: 'Password recover' },
          ]}
        />
        <Content />
      </Main>
      <Footer />
    </Layout>
  );
};

export default ResetPassword;

export const getServerSideProps = SiteServerSideProps('authorization');
