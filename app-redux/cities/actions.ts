import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { City } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const citiesUrl = `${BACKEND_URL}/cities`;

/**
 * City Actions
 */
export const citiesActions = { ...{
  //Custom actions
  }, ...crudActions<City>(citiesUrl, ACTION_TYPES ) };
