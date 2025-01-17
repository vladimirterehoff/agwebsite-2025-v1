// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import ServicesList from '@/containers/Admin/Services/List';
// Components
import LayoutAdmin  from '@/components/Admin/Layout/Layout';
// HOC
import Private from '@/hoc/admin/Private';
// SSR
import {AdminServerSideProps} from "@/ssr/admin";
import ReviewList from '@/containers/Admin/Review/List';

const Content = Private(ReviewList);

const Index: NextPage = () => {
  return (
    <>
      <LayoutAdmin>
          <Content />
      </LayoutAdmin>
    </>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private');