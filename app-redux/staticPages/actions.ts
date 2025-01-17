import {dispatch} from '@/app-redux/config';
import { crudActions } from '../COMMON/crud';
import { ACTION_TYPES } from './actionTypes';
import { StaticPage} from './model';
// Services
import api from "@/services/axios";
import {authorizationHeader} from '@/services/token';
// Constants
import { BACKEND_URL, API_URL } from '@/utils/envirenment';

export const staticPagesUrl = `${BACKEND_URL}/static-pages`;

/**
 * Static Pages Actions
 */
export const staticPagesActions = { ...{
    getStaticPage :  async (slug: string, token? :string ) => {
      try {
        dispatch({type: ACTION_TYPES.GET_STATIC_PAGE_API});
        const response = await api.get(`${API_URL}/static-pages/${slug}`, authorizationHeader(token));
        const data = response.data;
        dispatch({type: ACTION_TYPES.GET_STATIC_PAGE_API_SUCCESS, payload: data});
        return Promise.resolve(data);
      }
      catch (error : any) {
        dispatch({type: ACTION_TYPES.GET_STATIC_PAGE_API_ERROR, payload: error.message});
        return Promise.reject(error);
      }
    }
  }, ...crudActions<StaticPage>(staticPagesUrl, ACTION_TYPES ) };
