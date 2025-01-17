import { crudActions } from '../COMMON/crud/actions';
import { ACTION_TYPES } from './actionTypes';
import { CleanerReport } from './model';
import { BACKEND_URL } from '@/utils/envirenment';
import api from '@/services/axios';
import { fileDownload } from '@/helpers/fileDownload';

export const cleanerReportsUrl = `${BACKEND_URL}/reports/cleaners`;

type ExportTableParams = {
  date_from: string, // YYYY-MM-DD
  date_to: string // YYYY-MM-DD 
}

/**
 * Reports Cleaner Actions
 */
export const reportsCleanerActions = {
  ...crudActions<CleanerReport>(cleanerReportsUrl, ACTION_TYPES),
  exportTable: async (params: ExportTableParams) => {
    const response = await api.post(`${cleanerReportsUrl}/export`, {
      ...params,
    });

    fileDownload({
      data: response,
      filename: `reports-cleaners-${params.date_from}-${params.date_to}.csv`,
    });
  },
}; 