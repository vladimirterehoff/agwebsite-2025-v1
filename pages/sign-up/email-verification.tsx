// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import EmailVerification from '@/containers/Site/SignUp/EmailVerification';
// Components
import Layout from '@/components/Site/Layout';
import Footer from '@/components/Site/Footer';
import Main from '@/components/Site/Main';
import Header from '@/components/Site/Header';
import BreadCrumbs from '@/components/Common/BreadCrumbs';
// HOC
import Private from "@/hoc/site/Private";
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const Content = Private(EmailVerification);
const SignUp: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Main className={'content'}>
        <BreadCrumbs
          className="breadcrumbs"
          items={[
            { url: '/', text: 'Main' },
            { url: null, text: 'Sign Up' },
          ]}
        />
        <Content />
      </Main>
      <Footer />
    </Layout>
  );
};

export default SignUp;

export const getServerSideProps = SiteServerSideProps('private');