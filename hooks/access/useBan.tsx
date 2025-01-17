// Libs
import { useSelector } from 'react-redux'
// Redux
import { AppState } from '@/app-redux/state';
// Constants
import { PERMISSIONS } from '@/utils/permissins'

/**
 * Check Ban of authorized user
 */
export const useBan = () => {
    const profile = useSelector((state: AppState) => state.profile);
    const permissions = profile?.permissions;
    return !permissions.includes(PERMISSIONS.SIGN_IN) && !permissions.includes(PERMISSIONS.BACKEND_SIGN_IN);
};