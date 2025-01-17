import { crudActions } from '../COMMON/crud';
import { ACTION_TYPES } from './actionTypes';
import { Setting } from './model';
import { BACKEND_URL, API_URL } from 'utils/envirenment';
const url = `${BACKEND_URL}/settings`;

export const settingsActions = { ...{
  }, ...crudActions<Setting>(url, ACTION_TYPES ) };
