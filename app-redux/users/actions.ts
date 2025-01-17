import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { User } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const usersUrl = `${BACKEND_URL}/users`;

/**
 * Users Actions
 */
export const usersActions = { ...{
  //Custom actions
  }, ...crudActions<User>(usersUrl, ACTION_TYPES ) };
