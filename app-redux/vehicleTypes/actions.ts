import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { VehicleType } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const vehicleTypeUrl = `${BACKEND_URL}/vehicle-types`;

/**
 * V
 * ehicle Type Actions
 */
export const vehicleTypesActions = { ...{
  //Custom actions
  }, ...crudActions<VehicleType>(vehicleTypeUrl, ACTION_TYPES ) };
