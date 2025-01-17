import {crudState} from "../COMMON/crud";

export interface Setting {
  id : number | string;
  created_at: number;
  description:  string;
  key: string;
  type: string;
  updated_at: number;
  value: string;
}

export interface SettingState extends crudState<Setting>{}



