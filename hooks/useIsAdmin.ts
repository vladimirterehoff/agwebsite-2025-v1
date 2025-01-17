import { ROLE_SLUGS } from "@/app-redux/roles/model";
import { AppState } from "@/app-redux/state";
import { useSelector } from "react-redux";

const useCheckRole = () => {
    const { profile } = useSelector((state: AppState) => state.profile);
    const isSuperAdmin = profile?.relations?.roles?.some((role) => role.slug === ROLE_SLUGS.SUPER_ADMIN);
    const isWorkshopManager = profile?.relations?.roles?.some((role) => role.slug === ROLE_SLUGS.WORKSHOP_MANAGER);
    
    return {isSuperAdmin, isWorkshopManager};
}

export default useCheckRole;
