import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { Manufacturer } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const manufacturersUrl = `${BACKEND_URL}/manufacturers`;

/**
 * Manufacturers Actions
 */
export const manufacturersActions = { ...{
  //Custom actions
  }, ...crudActions<Manufacturer>(manufacturersUrl, ACTION_TYPES ) };
