// Libs
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// Redux
import { AppState} from '@/app-redux/state';
// Constants
import { SITE_PATH } from "@/utils/routers/site";

/**
 * HOC component for authorization pages. Check that user not authorized now
 * @param WrappedComponent - Container of the page
 * @constructor
 */
const Authorize = (WrappedComponent: any) => {
  const FuncComponent = ({ children, ...props }: any) => {
    const { push } = useRouter();
    const { profile } = useSelector((state: AppState) => state.profile);

    useEffect(() => {
      if(profile) push(SITE_PATH.ACCOUNT);
    }, [profile]);

    return  <WrappedComponent {...props}>{children}</WrappedComponent>;
  };

  return FuncComponent;
}

export default Authorize;