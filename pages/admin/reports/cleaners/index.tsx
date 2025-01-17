import React from 'react';
import { NextPage } from 'next';
import LayoutAdmin from '@/components/Admin/Layout/Layout';
import Private from '@/hoc/admin/Private';
import { AdminServerSideProps } from "@/ssr/admin";
import CleanerReportsList from '@/containers/Admin/ReportsCleaner/List';

const Content = Private(CleanerReportsList);

const Index: NextPage = () => {
  return (
    <LayoutAdmin>
      <Content />
    </LayoutAdmin>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private'); 