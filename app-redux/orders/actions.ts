import api from "@/services/axios";
import { crudActions } from "../COMMON/crud/actions";
import { ACTION_TYPES } from "./actionTypes";
import { Order } from "./model";
// Constants
import { BACKEND_URL } from "@/utils/envirenment";
import { fileDownload } from "@/helpers/fileDownload";
import { dispatch } from "../config";

export const ordersUrl = `${BACKEND_URL}/orders`;

type ExportTableParams = {
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
};

/**
 * Orders Actions
 */
export const ordersActions = {
    exportTable: async (params: string) => {
      const response = await api.post(`${ordersUrl}/export?${params}`, {
        // ...params,
      });

      fileDownload({
        data: response,
        filename: `reports-orders.csv`,
      });
    },
    refund: async (id: number | string) => {
      try {
        dispatch({ type: ACTION_TYPES.REFUND });
        const response = await api.post(`${ordersUrl}/${id}/refund`);
        dispatch({ type: ACTION_TYPES.REFUND_SUCCESS, payload: response.data });
        return response;
      } catch (error: any) {
        dispatch({ type: ACTION_TYPES.REFUND_FAILED, payload: error });
        throw error;
      }
    },
    sendMoney: async (id: number | string) => {
      try {
        dispatch({ type: ACTION_TYPES.SEND_MONEY });
        const response = await api.post(`${ordersUrl}/${id}/transfer-to-provider`);
        dispatch({ type: ACTION_TYPES.SEND_MONEY_SUCCESS, payload: response.data });
        return response;
      } catch (error: any) {
        dispatch({ type: ACTION_TYPES.SEND_MONEY_FAILED, payload: error });
        throw error;
      }
    },
    getRefundableNumber: async (params: string = '', saveInState: boolean = true) => {
      try {
        if (saveInState) dispatch({ type: ACTION_TYPES.GET_REFUNDABLE_NUMBER });
        const response: any = await api.get(`${ordersUrl}?limit=1&scopes=[{"name":"refundable","parameters":[]}]&${params}`);
        const refundableNumber = response?.meta?.total;
        if (saveInState) dispatch({ type: ACTION_TYPES.GET_REFUNDABLE_NUMBER_SUCCESS, payload: refundableNumber });
        return refundableNumber || 0;
      } catch (error: any) {
        if (saveInState) dispatch({ type: ACTION_TYPES.GET_REFUNDABLE_NUMBER_FAILED, payload: error });
        throw error;
      }
    },
  ...crudActions<Order>(ordersUrl, ACTION_TYPES),
};
