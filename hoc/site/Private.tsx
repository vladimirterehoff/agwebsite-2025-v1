// Libs
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// Redux
import { AppState} from '@/app-redux/state';
// Components
import Loader from "@/components/Common/Loader";
// Hooks
import {useEmailVerify} from "@/hooks/access/useEmailVerify";
import {useBan} from "@/hooks/access/useBan";
import {usePermissions} from "@/hooks/access/usePermissions";
// Constants
import { NEED_CHECK_EMAIL_VERIFICATION, NEED_CHECK_BAN, NEED_CHECK_PERMISSIONS } from "@/utils/config/site";
import {NOT_PERMISSIONS} from "@/utils/routers/base";
import {SITE_PATH} from "@/utils/routers/site";

/**
 * HOC component for private(profile) pages. Check that user is authorized and have access
 * @param WrappedComponent - Container of the page
 * @param permissions - array of permissions, that have access to this page
 * @constructor
 */
const Private = (WrappedComponent: any, permissions?:string[]) => {
  const FuncComponent = ({ children, ...props }: any) => {
    const { push } = useRouter();
    const profile = useSelector((state: AppState) => state.profile);
    const [pageReady, setPageReady] = useState(false);
    const isEmailVerify = useEmailVerify();
    const isBan = useBan();
    const { hasPermissions } = usePermissions();

    useEffect(() => {
      !profile.profile && push(SITE_PATH.SIGN_IN);
      NEED_CHECK_EMAIL_VERIFICATION && !isEmailVerify &&  push(NOT_PERMISSIONS);
      NEED_CHECK_BAN && isBan && push(NOT_PERMISSIONS);
      NEED_CHECK_PERMISSIONS && !hasPermissions(permissions) && push(NOT_PERMISSIONS);
      setPageReady(true);
    }, [profile]);

    return pageReady? (
      <WrappedComponent {...props}>{children}</WrappedComponent>
    ) : (
      <>
        <Loader isLoading={true}/>
      </>
    );
  };

  return FuncComponent;
};

export default Private;
