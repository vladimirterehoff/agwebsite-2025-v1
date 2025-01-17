// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import CityZonesForm from "@/containers/Admin/CityZones/Form";
// Components
import LayoutAdmin  from '@/components/Admin/Layout/Layout';
// HOC
import Private from '@/hoc/admin/Private';
// SSR
import {AdminServerSideProps} from "@/ssr/admin";

const Content = Private(CityZonesForm);

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
