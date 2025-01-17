import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { CityZone } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const cityZonesUrl = `${BACKEND_URL}/city-zones`;

/**
 * City zones Actions
 */
export const cityZonesActions = { ...{
  //Custom actions
  }, ...crudActions<CityZone>(cityZonesUrl, ACTION_TYPES ) };
