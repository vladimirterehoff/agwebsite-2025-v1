// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import Home from '@/containers/Site/Home';
// Components
import Layout from '@/components/Site/Layout';
import Header from '@/components/Site/Header';
import Main from '@/components/Site/Main';
import Footer from '@/components/Site/Footer';
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const Index: NextPage = () => {
  return (
    <>
      <Layout>
        <Header />
        <Main>
          <Home/>
        </Main>
        <Footer />
      </Layout>
    </>
  );
};
export default Index;

export const getServerSideProps = SiteServerSideProps('public', ()=>{
  //get data for current page
});
