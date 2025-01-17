import { crudState } from "../COMMON/crud";

export interface ServiceReport {
  id: number;
  name: string;
  order_count: number;
  unique_user_count: number;
}

export interface ServiceReportsState extends crudState<ServiceReport> {}
