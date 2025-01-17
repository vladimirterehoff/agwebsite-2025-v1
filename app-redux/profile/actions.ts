import { dispatch } from '@/app-redux/config';
import { AppState } from '@/app-redux/state';
import { ACTION_TYPES} from './actionTypes';
// Services
import { authorizationHeader } from '@/services/token';
import api from '@/services/axios';
// Helpers
import {FilterService} from "@/helpers/filterService";
// Constants
import { API_URL, BACKEND_URL } from '@/utils/envirenment';
import { SCOPE } from '@/utils/config/base';

//DEFAULT FILTER FOR PROFILE
export const filter = new FilterService();
filter.expand(['roles'])

/**
 * Profile Actions
 */
export const profileActions = {
  getProfile : async (params: string = '', scope : SCOPE = SCOPE.SITE, ssrStore? : AppState, token?:string) => {
    try {
      dispatch({ type: ACTION_TYPES.GET_PROFILE }, ssrStore);
      const url = `${scope == SCOPE.SITE ? API_URL : BACKEND_URL}/profile?${params || filter.filter}`;
      const response = await api.get(url, authorizationHeader(token));
      const user = {...response.data, permissions: response.data?.relations.permissions?.map((i: any) => i?.slug)};
      
      dispatch({
        type: ACTION_TYPES.GET_PROFILE_SUCCESS,
        payload: user,
      }, ssrStore);

      return Promise.resolve(user);
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.GET_PROFILE_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  updateProfile :async (form: object) => {
    try {
      dispatch({ type: ACTION_TYPES.UPDATE_PROFILE });
      const response = await api.put(`${API_URL}/profile`, form);
      const user: any = response.data;
      dispatch({
        type: ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
        payload: user,
      });
      return Promise.resolve(user);
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.UPDATE_PROFILE_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  clearProfile: async () => {
    dispatch({type: ACTION_TYPES.CLEAN_PROFILE});
  }
};
