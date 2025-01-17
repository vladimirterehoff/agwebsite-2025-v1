// Libs
import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
// Containers
import ServiceForm from '@/containers/Admin/Services/Form';
// Components
import LayoutAdmin  from '@/components/Admin/Layout/Layout';
// HOC
import Private from '@/hoc/admin/Private';
// SSR
import {AdminServerSideProps} from "@/ssr/admin";

const Content = Private(ServiceForm);

const Index: NextPage = () => {
  const { query } = useRouter();
  return (
    <>
      <LayoutAdmin>
          {query.id && <Content id={String(query.id)}/>}
      </LayoutAdmin>
    </>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private');