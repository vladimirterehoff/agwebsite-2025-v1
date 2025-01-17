import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { MultiLangString } from "../COMMON/model/multilang";

/**
 * @interface Manufacturer
 */
export interface Manufacturer extends CrudItem {
  name: string;
  description: MultiLangString;
  is_active: boolean;
}

/**
 * @interface ManufacturerState
 */
export interface ManufacturerState extends crudState<Manufacturer> {}
