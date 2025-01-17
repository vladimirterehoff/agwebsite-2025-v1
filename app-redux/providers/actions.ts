import api from "@/services/axios";
import { crudActions } from "../COMMON/crud/actions";
import { ACTION_TYPES } from "./actionTypes";
import { Provider } from "./model";
import { BACKEND_URL } from "@/utils/envirenment";
import { fileDownload } from "@/helpers/fileDownload";

export const providersUrl = `${BACKEND_URL}/providers`;

export const providersActions = {
  exportTable: async (params: string = '') => {
    const response = await api.post(`${providersUrl}/export?${params}`);
    
    fileDownload({
      data: response,
      filename: `providers-payouts.csv`,
    });
  },
  ...crudActions<Provider>(providersUrl, ACTION_TYPES),
};
