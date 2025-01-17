import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Media } from "../COMMON/model/media";
import { MultiLangString } from "../COMMON/model/multilang";
import { User } from "../users/model";
import { VehicleType } from "../vehicleTypes/model";

/**
 * @interface Service
 */
export interface Service extends CrudItem {
  user_id: number;
  name: MultiLangString;
  description: MultiLangString;
  type: null;
  availability: SERVICE_AVAILABILITY;
  relations?: ServiceRelations;
}

export enum SERVICE_AVAILABILITY {
  ALL = "all",
  STATIONARY = "stationary",
  MOBILE = "mobile",
}

/**
 * @interface ServiceRelations
 */
interface ServiceRelations {
  user?: User;
  avatar?: Media;
  vehicleTypes?: ServiceVehicleType[];
}
/**
 * @interface ServiceVehicleType
 */
export interface ServiceVehicleType extends VehicleType {
  price: number;
  time: number; // in minutes
  isChecked?: boolean;
}

/**
 * @interface ProvidersState
 */
export interface ServicesState extends crudState<Service> {}
