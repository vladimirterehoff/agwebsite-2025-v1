// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import StyleGuideSite from '@/containers/StyleGuide/Site';
// Components
import Layout from '@/components/Site/Layout';
import Footer from '@/components/Site/Footer';
import Main from '@/components/Site/Main';
import Header from '@/components/Site/Header';
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const StyleGuideSitePage: NextPage = () => {
  return (
    <>
      <Layout>
        <Header />
        <Main>
          <StyleGuideSite/>
        </Main>
        <Footer />
      </Layout>
    </>
  );
};
export default StyleGuideSitePage;

export const getServerSideProps = SiteServerSideProps('public', ()=>{
});
