import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { Service } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const servicesUrl = `${BACKEND_URL}/services`;

/**
 * Users Actions
 */
export const servicesActions = { ...{
  //Custom actions
  }, ...crudActions<Service>(servicesUrl, ACTION_TYPES ) };
