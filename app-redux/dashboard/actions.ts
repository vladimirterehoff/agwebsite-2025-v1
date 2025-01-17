import { ACTION_TYPES } from './actionTypes';
// Constants
import {BACKEND_URL} from '@/utils/envirenment';
import {SCOPE} from "@/utils/config/base";
import {AppState} from "@/app-redux/state";
import {dispatch} from "@/app-redux/config";
import api from "@/services/axios";
import {authorizationHeader} from "@/services/token";
import {filter} from "@/app-redux/profile/actions";

export const dashboardUrl = `${BACKEND_URL}/dashboard`;

/**
 * Dashboard Actions
 */
export const DashboardActions = {
  getOrdersGraph : async (params: string = '', scope : SCOPE = SCOPE.SITE, ssrStore? : AppState, token?:string) => {
    try {
      dispatch({ type: ACTION_TYPES.GET_ORDERS_GRAPH }, ssrStore);
      const url = `${dashboardUrl}/orders?${params || filter.filter}`;
      const response = await api.get(url, authorizationHeader(token));

      dispatch({
        type: ACTION_TYPES.GET_ORDERS_GRAPH_SUCCESS,
        payload: response.data,
      }, ssrStore);

      return Promise.resolve(response.data);
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.GET_ORDERS_GRAPH_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },
};
