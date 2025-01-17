// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import SignInPage from '@/containers/Site/SignIn';
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

const Content = Authorize(SignInPage);

const Index: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Main className={'content'}>
        <BreadCrumbs
          className="breadcrumbs"
          items={[
            { url: '/', text: 'Main' },
            { url: null, text: 'Sign In' },
          ]}
        />
        <Content />
      </Main>
      <Footer />
    </Layout>
  );
};

export default Index;

export const getServerSideProps = SiteServerSideProps('authorization');