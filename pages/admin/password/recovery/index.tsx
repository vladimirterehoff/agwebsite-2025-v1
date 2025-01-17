import React from 'react';
import { NextPage } from 'next';
import RecoveryPasswordBackendPage from 'containers/Admin/RecoveryPassword';
import LayoutAuthorisation from '@/components/Admin/Layout/LayoutAuthorisation';
import {AdminServerSideProps} from "ssr/admin";
import Authorize from 'hoc/admin/Authorize';

const Content = Authorize(RecoveryPasswordBackendPage);
const Index: NextPage = () => {
  return (
    <LayoutAuthorisation title={'Password recovery'}
                         title_sub_text={''}>
        <Content />
    </LayoutAuthorisation>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('authorization');
