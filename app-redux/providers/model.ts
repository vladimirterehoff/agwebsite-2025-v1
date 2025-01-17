import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Media } from "../COMMON/model/media";
import { MultiLangString } from "../COMMON/model/multilang";
import { Service } from "../services/model";
import { User } from "../users/model";
import {Order} from "@/app-redux/orders/model";

/**
 * @interface Provider
 */
export interface Provider extends CrudItem {
  user_id: number;
  name: MultiLangString;
  description: MultiLangString;
  type: null;
  availability: "all" | "stationary";
  status: PROVIDER_STATUS;
  relations?: ProviderRelations;
  is_active: boolean;
  bank_details: string;
  total_withdrawn: string;
  total_earned: string;
  orders_count: number;
  rating: number;
}

export enum PROVIDER_TYPE {
  MOBILE = "mobile",
  STATIONARY = "stationary",
}

export enum PROVIDER_STATUS {
  AVAILABLE = "available",
  NOT_AVAILABLE = "not_available",
}

/**
 * @interface ProviderRelations
 */
interface ProviderRelations {
  wallet?: Wallet;
  user?: User;
  avatar?: Media;
  photos?: Media[];
  contacts?: Contact[];
  services: Service[];
  schedule?: Schedule;
  cityZones?: CityZone[];
  activeOrder?: Order;
}

/**
 * @interface Wallet
 */
interface Wallet {
  id: number;
  balance: string; // "324.00"
}

/**
 * @interface Contact
 */
export interface Contact extends CrudItem {
  name: string;
  phone: string;
  email: string;
  relationship: string;
  provider_id: number;
  updated_at: number;
}

/**
 * @interface Schedule
 */
export interface Schedule {
  start_time: string; // "08:00:00"
  end_time: string; //  "18:00:00"
  lunch_start_time: string; // "13:00:00"
  lunch_end_time: string; // "14:00:00"
  day_offs: number[];
  extra_day_offs: string[]; // "2024-11-28"
}


/**
 * @interface City
 */
interface City extends CrudItem {
  name: MultiLangString;
}

/**
 * @interface CityZone
 */
interface CityZone extends CrudItem {
  city_id: number;
  name: MultiLangString;
  color: string;
  polygon: {
    latitude: number;
    longitude: number;
  }[];
  relations: {
    city: City;
  };
}

    

/**
 * @interface ProvidersState
 */
export interface ProvidersState extends crudState<Provider> {}
