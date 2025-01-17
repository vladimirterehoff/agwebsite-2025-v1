// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import SignInBackendPage from '@/containers/Admin/SignIn';
// Components
import LayoutAuthorisation from '@/components/Admin/Layout/LayoutAuthorisation';
// HOC
import Authorize from '@/hoc/admin/Authorize';
// SSR
import {AdminServerSideProps} from "@/ssr/admin";

const Content = Authorize(SignInBackendPage);
const Index: NextPage = () => {
  return (
    <LayoutAuthorisation title={'Sign In'}
                         title_sub_text={'Please enter your data to access your account.'}>
        <Content />
    </LayoutAuthorisation>
  );
};

export default Index;
export const getServerSideProps = AdminServerSideProps('authorization');