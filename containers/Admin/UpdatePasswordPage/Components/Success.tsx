// Libs
import Link from 'next/link';
import React from "react";
// MUI Components
import Box from "@mui/material/Box";
// Components
import Button from '@/components/Common/Button';
// Utils
import { ADMIN_PATH } from '@/utils/routers/admin';

/**
 * Success update password
 */
const Success = () => {
  return (
    <>
      <div className={`m-b-30`}>
        Password successfully updated
      </div>

      <div className={``}>
        You will ne redirected to login page in a few seconds.
      </div>

      <Box className={'m-t-20'}>
          <Link href={ADMIN_PATH.LOGIN}>
            <Button type="button" fullWidth className="btn_flat">
              Go to Log In
            </Button>
          </Link>
      </Box>
    </>
  );
};

export default Success;
