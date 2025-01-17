import { fileDownload } from "@/helpers/fileDownload";
import { crudActions } from "../COMMON/crud/actions";
import { ACTION_TYPES } from "./actionTypes";
import { Withdrawal } from "./model";
// Constants
import { BACKEND_URL } from "@/utils/envirenment";
import api from "@/services/axios";

export const withdrawalsUrl = `${BACKEND_URL}/withdrawals`;

type ExportTableParams = {
  date_from: string, // YYYY-MM-DD
  date_to: string // YYYY-MM-DD 
}

/**
 * Withdrawals Actions
 */
export const withdrawalsActions = {
  exportTable: async (params: ExportTableParams) => {
    const response = await api.post(`${withdrawalsUrl}/export`, {
      ...params,
    });

    fileDownload({
      data: response,
      filename: `reports-withdrawals-${params.date_from}-${params.date_to}.csv`,
    });
  },
  ...crudActions<Withdrawal>(withdrawalsUrl, ACTION_TYPES),
}; 