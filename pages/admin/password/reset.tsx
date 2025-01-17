// Libs
import { NextPage } from 'next';
// Containers
import UpdatePasswordPage from '@/containers/Admin/UpdatePasswordPage';
// Components
import LayoutAuthorisation from '@/components/Admin/Layout/LayoutAuthorisation';
// HOC
import Authorize from '@/hoc/admin/Authorize';
// SSR
import {AdminServerSideProps} from "@/ssr/admin";

const Content = Authorize(UpdatePasswordPage);
const ResetPassword: NextPage = () => {
  return (
    <LayoutAuthorisation title={'Password recovery'}
                         title_sub_text={'Create new password'}>
        <Content />
    </LayoutAuthorisation>
  );
};

export default ResetPassword;
export const getServerSideProps = AdminServerSideProps('authorization');
