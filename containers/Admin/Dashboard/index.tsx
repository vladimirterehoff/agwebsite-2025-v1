// Libs
import React from 'react';
// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// Components
import ContentHeader from '@/components/Admin/ContentHeader';
import OrdersGraph from "@/containers/Admin/Dashboard/Components/OrdersGraph";
import {CustomerFeedback} from "@/containers/Admin/Dashboard/Components/CustomerFeedback";
// Constants
import {ADMIN_MAIN} from "@/utils/routers/admin";
import {useSelector} from "react-redux";
import {AppState} from "@/app-redux/state";
import {ROLE_SLUGS} from "@/app-redux/roles/model";
import {hasRole} from "@/utils/permissins";
import {useRoles} from "@/hooks/useRoles";

/**
 * Dashboard Container
 * @constructor
 */
const Dashboard = () => {
  const roles = useRoles();
  return (
    <>
      <ContentHeader title='Dashboard'
                     needAddLink={false}
                     modelName="Dashboard"
                     urlSlug={ADMIN_MAIN}
                     breadcrumbs={[
                       {url: false, text: 'Dashboard'}]}/>

      <Box mt={3}>
        <Card>
          <OrdersGraph/>
        </Card>
        {
          hasRole(roles, ROLE_SLUGS.SUPER_ADMIN) &&
            <Card style={{width: 600, marginTop: 20}}>
                <CustomerFeedback/>
            </Card>
        }
      </Box>
    </>
  );
};

export default Dashboard;
