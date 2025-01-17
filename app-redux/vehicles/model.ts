import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Media } from "../COMMON/model/media";
import { Manufacturer } from "../manufacturers/model";
import { User } from "../users/model";
import { VehicleType } from "../vehicleTypes/model";

/**
 * @interface Vehicle
 */
export interface Vehicle extends CrudItem {
  user_id: number;
  manufacturer_id: number;
  vehicle_type_id: number;
  model: string;
  body_type: string;
  license_plate: string;
  color: string;
  relations: VehicleRelations;
}

/**
 * @interface Vehicle
 */
export interface VehicleRelations {
  user?: User,
  manufacturer?: Manufacturer,
  vehicleType?: VehicleType,
  photosExterior?: Media[], // ???
  photosInterior?: Media[], // ???
}

/**
 * @interface VehiclesState
 */
export interface VehiclesState extends crudState<Vehicle> {}
