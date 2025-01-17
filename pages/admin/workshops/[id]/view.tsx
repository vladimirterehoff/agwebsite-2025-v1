// pages/admin/workshops/view/[id].tsx
import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import WorkshopViewer from '@/containers/Admin/Workshops/View';
import LayoutAdmin from '@/components/Admin/Layout/Layout';
import Private from '@/hoc/admin/Private';
import { AdminServerSideProps } from "@/ssr/admin";

const Content = Private(WorkshopViewer);

const Index: NextPage = () => {
  const { query } = useRouter();
  return (
    <LayoutAdmin>
      {query.id && <Content id={String(query.id)}/>}
    </LayoutAdmin>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private');