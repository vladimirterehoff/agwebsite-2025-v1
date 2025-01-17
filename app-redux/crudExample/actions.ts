import {dispatch} from '@/app-redux/config';
import { crudActions } from '@/app-redux/COMMON/crud';
import { ACTION_TYPES } from './actionTypes';
import { CrudExampleModel } from './model';
// Services
import api from "@/services/axios";
// Constants
import { BACKEND_URL, API_URL } from '@/utils/envirenment';

export const url = `${BACKEND_URL}/crud_example`;

/**
 * Crud Example Actions
 */
export const crudExampleActions = { ...{
    // Some custom action
  }, ...crudActions<CrudExampleModel>(url, ACTION_TYPES ) };
