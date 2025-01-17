import {crudState} from "@/app-redux/COMMON/crud";

/**
 * @interface CrudExampleModel
 */
export interface CrudExampleModel {
  id : number,
  name: string;
}

/**
 * @interface CrudExampleState
 */
export interface CrudExampleState extends crudState<CrudExampleModel>{}



