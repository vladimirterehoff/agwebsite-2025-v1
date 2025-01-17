// Libs
import React, {useEffect} from 'react';
import { NextPage } from 'next';
// Containers
import CommonGuide from '@/containers/StyleGuide/Common';
// SSR
import {SiteServerSideProps} from "@/ssr/site";

const StyleGuideFormPage = () => {
  return (
    <>
      <div>
          <CommonGuide/>
      </div>
    </>
  );
};
export default StyleGuideFormPage;

export const getServerSideProps = SiteServerSideProps('public');
