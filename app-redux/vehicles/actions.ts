import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { Vehicle } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const vehiclesUrl = `${BACKEND_URL}/vehicles`;

/**
 * Vehicles Actions
 */
export const vehiclesActions = { ...{
  //Custom actions
  }, ...crudActions<Vehicle>(vehiclesUrl, ACTION_TYPES ) };
