import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { Role } from './model';
import { BACKEND_URL } from 'utils/envirenment';

export const rolesActions = {
  ...crudActions<Role>(`${BACKEND_URL}/roles`, ACTION_TYPES),
};
