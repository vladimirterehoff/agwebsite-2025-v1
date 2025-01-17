import { ROLE_SLUGS } from "@/app-redux/roles/model";
import { AppState } from "@/app-redux/state";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const AdminEditButton = () => {
    const { profile } = useSelector((state: AppState) => state.profile);

    const { asPath } = useRouter()


    const isAdmin = profile?.relations?.roles?.some((role) => role.slug === ROLE_SLUGS.SUPER_ADMIN);
    
    if (isAdmin) {
      return (
        <Button variant="contained" color="primary" href={asPath.replace('/view', '')}>Edit</Button>
      )
    }
    return null;
}

export default AdminEditButton;