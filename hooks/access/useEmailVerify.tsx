// Libs
import { useSelector } from 'react-redux'
// Redux
import { AppState } from '@/app-redux/state';

/**
 * Check email of authorized user is verified or not
 */
export const useEmailVerify = () => {
    const profile = useSelector((state: AppState) => state.profile);
    return profile?.email_verified_at;
};