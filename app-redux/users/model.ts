import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Media } from "../COMMON/model/media";
import {Provider} from "@/app-redux/providers/model";

/**
 * @interface User
 */
export interface User extends CrudItem {
  // id: string | number;
  // email: string | null;
  // name: string | null;
  email_verified_at: string | null;
  // role_ids: (string | number)[] | [];

  balance: number;
  birthday: null; // ???
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  full_name: string;
  last_seen_at: number;
  location: null; // ???
  passport_data: {
    id: number;
    identification_number: number;
    residential_address: string;
  } | null;
  personal_email: string | null;
  phone: string;
  reserve_phone: string | null;
  status: string;
  terms_accepted_at: number;
  timezone: null;

  relations?: UserRelations; // ???
  permissions: string[]; // ???
}

/**
 * @interface UserRelations
 */
interface UserRelations {
  roles?: Role[];
  permissions?: Permission[];
  avatar?: Media;
  provider?: Provider;
  providers?: Provider[];
}

/**
 * @interface Role
 */
export interface Role {
  id: number;
  name: string;
  slug: string;
}

/**
 * @interface Permission
 */
export interface Permission {
  created_at: number;
  id: number;
  name: string;
  slug: string;
  updated_at: number;
}

/**
 * @interface UsersState
 */
export interface UsersState extends crudState<User> {}
