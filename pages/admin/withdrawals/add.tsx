import React, { useMemo } from 'react';
import { NextPage } from 'next';
import LayoutAdmin  from '@/components/Admin/Layout/Layout';
import Form from 'containers/Admin/Withdrawals/Form';
import {AdminServerSideProps} from "ssr/admin";
import Private from 'hoc/admin/Private';
import { useRouter } from 'next/router';

const Content = Private(Form);

const Index: NextPage = () => {
  const { query } = useRouter();
  const providerId = useMemo(() => {
    if (query.providerId) {
      return query.providerId;
    }
  }, [query.providerId]);
  return (
    <>
      <LayoutAdmin>
        <Content providerId={providerId} />
      </LayoutAdmin>
    </>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('private');
