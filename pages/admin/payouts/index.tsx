import React from 'react';
import { NextPage } from 'next';
import LayoutAdmin from '@/components/Admin/Layout/Layout';
import PayoutsTable from '@/containers/Admin/Payouts';
import { AdminServerSideProps } from "ssr/admin";
import Private from 'hoc/admin/Private';

const Content = Private(PayoutsTable);

const Index: NextPage = () => {
  return (
    <LayoutAdmin>
      <Content />
    </LayoutAdmin>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private'); 