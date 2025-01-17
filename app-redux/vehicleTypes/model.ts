import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { MultiLangString } from "../COMMON/model/multilang";

/**
 * @interface VehicleType
 */
export interface VehicleType extends CrudItem {
  name: MultiLangString;
  description: MultiLangString;
  is_active: boolean;
}

/**
 * @interface VehicleTypesState
 */
export interface VehicleTypesState extends crudState<VehicleType> {}
