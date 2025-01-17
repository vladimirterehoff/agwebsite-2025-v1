// Libs
import { useSelector } from 'react-redux'
// Redux
import { AppState } from '@/app-redux/state';

/**
 * Check permissions of authorized user
 * @param permissions
 */
export const usePermissions = () => {
  const profile = useSelector((state: AppState) => state.profile);

  const hasPermissions = (permissions? : string[]) => {
    if(permissions){
      let access = false;
      permissions.forEach((perm)=>{
        if(profile?.permissions.indexOf(perm)>=0) access = true;
      })
      return access;
    }
    else return true;
  }

  return{
    hasPermissions
  }
};
