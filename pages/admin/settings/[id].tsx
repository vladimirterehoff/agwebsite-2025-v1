import React from 'react';
import { NextPage } from 'next';
import LayoutAdmin  from '@/components/Admin/Layout/Layout';
import { useRouter } from 'next/router';
import Form from 'containers/Admin/Settings/Form';
import {AdminServerSideProps} from "ssr/admin";
import Private from 'hoc/admin/Private';

const Content = Private(Form);

const Index: NextPage = () => {
  const { query } = useRouter();
  return (
    <>
      <LayoutAdmin>
          {query.id && <Content id={Number(query.id)}/>}
      </LayoutAdmin>
    </>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private');
