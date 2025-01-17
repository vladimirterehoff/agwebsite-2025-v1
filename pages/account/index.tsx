// Libs
import React from "react";
// Containers
import AccountMainPage from '@/containers/Site/Account/Main';
// Components
import Layout from '@/components/Site/Layout';
import Footer from '@/components/Site/Footer';
import Main from '@/components/Site/Main';
import Header from '@/components/Site/Header';
// HOC
import Private from "@/hoc/site/Private";
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const Content = Private(AccountMainPage);
const Index: React.FC = () => {
 return  (
    <>
      <Layout>
        <Header />
        <Main className="account-content content">
          <Content />
        </Main>
        <Footer />
      </Layout>
    </>
  );
};

export default Index;
export const getServerSideProps = SiteServerSideProps('private');