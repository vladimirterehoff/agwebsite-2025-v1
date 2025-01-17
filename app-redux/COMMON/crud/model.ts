import {Pagination} from "../model/pagination";

/**
 * @interface crudState - default crud state
 */
export interface crudState<T> {
  pagination : Pagination | null;
  loading: boolean;
  error?: string | null;
  list: T[] | [];
  data: T | null;
}

export interface ErrorModel {
  errors: string[],
  field: string,
}