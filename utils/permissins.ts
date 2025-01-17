export enum PERMISSIONS {
  ADMIN           = 'admin',
  USER            = 'user',

  /***********/
  SIGN_IN         = 'sign-in', //for site
  BACKEND_SIGN_IN = 'backend-sign-in', //for admin panel
};

export const hasRole = (roles: Array<{ slug: string }>, roleSlug: string): boolean => {
  return roles?.some((role) => role.slug === roleSlug);
};
