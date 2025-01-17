// Libs
import React, {useEffect} from "react";
import { NextPage } from 'next';
import {useSelector} from "react-redux";
// Redux
import {staticPagesActions} from "@/app-redux/staticPages/actions";
import {AppState} from "@/app-redux/state";
// Containers
import StaticPage from "@/containers/Site/StaticPage";
// Components
import Layout from '@/components/Site/Layout';
import Footer from '@/components/Site/Footer';
import Main from '@/components/Site/Main';
import Header from '@/components/Site/Header';
import BreadCrumbs from '@/components/Common/BreadCrumbs';
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const slug = 'terms-of-use';

const TermsOfUsePage: NextPage = () => {
  const { data } = useSelector((state: AppState) => state.staticPages);

  useEffect(()=> {
    if(!data || (data && data.slug != slug)){
      try{ staticPagesActions.getStaticPage(slug); }
      catch (e) {}
    }
  }, []);

  return (
    <Layout>
      <Header />
      <Main className={'content'}>
        <BreadCrumbs
          className="breadcrumbs"
          items={[
            { url: '/', text: 'Main' },
            { url: null, text: 'Terms of Use' },
          ]}
        />

        <StaticPage title={'Terms of Use'}/>

      </Main>
      <Footer />
    </Layout>
  );
};

export default TermsOfUsePage;

export const getServerSideProps = SiteServerSideProps('public',async (ssrStore, query)=>{
 /* try{  await staticPagesActions.getStaticPage(slug, token); }
  catch (e) {}*/
});