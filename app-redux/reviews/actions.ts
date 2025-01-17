import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { Review } from './model';
// Constants
import { BACKEND_URL} from '@/utils/envirenment';

export const reviewsUrl = `${BACKEND_URL}/reviews`;

/**
 * Reviews Actions
 */
export const reviewsActions = { ...{
  //Custom actions
  }, ...crudActions<Review>(reviewsUrl, ACTION_TYPES ) };
