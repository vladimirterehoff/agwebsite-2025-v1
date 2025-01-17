import { crudState } from '../COMMON/crud';

export interface Role {
  id: number;
  slug: ROLE_SLUGS;
  name: string;
  created_at: number;
  updated_at: number;
}

export enum ROLE_SLUGS {
  SIGN_IN = 'sign-in',
  BACKEND_SIGN_IN = 'backend-sign-in',
  SUPER_ADMIN = 'super-admin',
  WORKSHOP_MANAGER = 'workshop-manager',
  USER = 'user',
  DISPATCH_MANAGER = 'dispatch-manager',
  CLEANER = 'cleaner',
  CLEANER_ACCESS = 'cleaner-access',
}

export enum PERMISSION_SLUGS {
  SIGN_IN = 'sign-in-access',
  BACKEND_SIGN_IN = 'backend-sign-in-access',
  SUPER_ADMIN = 'super-admin-access',
  WORKSHOP_MANAGER = 'workshop-manager-access',
  USER = 'user-access',
  DISPATCH_MANAGER = 'dispatch-manager-access',
  CLEANER = 'cleaner-access',
  CLEANER_ACCESS = 'cleaner-access',
}

export const HIDE_ROLES = [ROLE_SLUGS.BACKEND_SIGN_IN, ROLE_SLUGS.SIGN_IN];

export interface RolesState extends crudState<Role> {}
