import React from 'react';
import { NextPage } from 'next';
import LayoutAdmin from '@/components/Admin/Layout/Layout';
import Private from '@/hoc/admin/Private';
import { AdminServerSideProps } from "@/ssr/admin";
import ServiceReportsList from '@/containers/Admin/ReportsService/List';

const Content = Private(ServiceReportsList);

const Index: NextPage = () => {
  return (
    <LayoutAdmin>
      <Content />
    </LayoutAdmin>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private'); 