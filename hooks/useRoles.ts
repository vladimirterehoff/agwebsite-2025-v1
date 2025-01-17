// hooks/useRoles.ts
import { useSelector } from "react-redux";
import { AppState} from '@/app-redux/state';

export const useRoles = () => {
  const { profile } = useSelector((state: AppState) => state.profile);
  return profile?.relations?.roles || [];
};
