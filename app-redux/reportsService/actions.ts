import api from '@/services/axios';
import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { ServiceReport } from './model';
import { BACKEND_URL } from '@/utils/envirenment';
import { fileDownload } from '@/helpers/fileDownload';

export const serviceReportsUrl = `${BACKEND_URL}/reports/services`;

type ExportTableParams = {
  date_from: string, // YYYY-MM-DD
  date_to: string // YYYY-MM-DD 
}

/**
 * Reports Service Actions
 */
export const reportsServiceActions = {
  ...crudActions<ServiceReport>(serviceReportsUrl, ACTION_TYPES),
  exportTable: async (params: ExportTableParams) => {
    const response = await api.post(`${serviceReportsUrl}/export`, {
      ...params,
    });

    fileDownload({
      data: response,
      filename: `reports-services-${params.date_from}-${params.date_to}.csv`,
    });
  }
}; 