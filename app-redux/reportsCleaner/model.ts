import { crudState } from "../COMMON/crud";

export interface CleanerReport {
  id: 1;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  rating: string;
  order_finished_count: number;
  order_declined_count: number;
}

export interface CleanerReportsState extends crudState<CleanerReport> {}
