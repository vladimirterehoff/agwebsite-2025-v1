import { ROLE_SLUGS } from "@/app-redux/roles/model";
import { User } from "@/app-redux/users/model";
import { roleBackendSignInSlugs, roleSignInSlugs } from "../../Form";

const checkActiveUser = (user: User): boolean => {
  const roles = user.relations?.roles;
  if (!roles) return false;

  const hasRole = (slug: string | string[]) =>
    Array.isArray(slug)
      ? roles.some((role: any) => slug.includes(role.slug))
      : roles.some((role: any) => role.slug === slug);

  const isUser = hasRole(roleSignInSlugs);
  const isSignIn = hasRole(ROLE_SLUGS.SIGN_IN);
  const isAdmin = hasRole(roleBackendSignInSlugs);
  const isBackendSignIn = hasRole(ROLE_SLUGS.BACKEND_SIGN_IN);

  const isActiveUser = isUser && isSignIn;
  const isActiveAdmin = isAdmin && isBackendSignIn;

  return isActiveUser || isActiveAdmin;
};


export default checkActiveUser;
