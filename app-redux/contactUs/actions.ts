import api from '@/services/axios';
import { crudActions } from '../COMMON/crud/actions';
import {dispatch} from '@/app-redux/config';
import { ACTION_TYPES } from './actionTypes';
import { ContactUs } from './model';
// Constants
import { BACKEND_URL } from '@/utils/envirenment';
import { authorizationHeader } from '@/services/token';

export const contactUsUrl = `${BACKEND_URL}/contact-us`;

/**
 * ContactUs Actions
 */
export const contactUsActions = {
  ...crudActions<ContactUs>(contactUsUrl, ACTION_TYPES),

  getOptions : async (token? :string) => {
    try {
      dispatch({ type: ACTION_TYPES.GET_OPTIONS });
      const response = await api.get(`${contactUsUrl}/options?limit=20`, authorizationHeader(token));
      console.log('>> response', response.data);
    
      dispatch({
        type: ACTION_TYPES.GET_OPTIONS_SUCCESS,
        payload: response.data,
      });

      return Promise.resolve(response.data);
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.GET_OPTIONS_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },
};
