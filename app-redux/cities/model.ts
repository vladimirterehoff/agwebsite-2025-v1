import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { MultiLangString } from "../COMMON/model/multilang";

/**
 * @interface City
 */
export interface City extends CrudItem {
  name: MultiLangString;
}


/**
 * @interface CitiesState
 */
export interface CitiesState extends crudState<City> {}
