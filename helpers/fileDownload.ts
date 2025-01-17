export const fileDownload = (params: { data: any, filename: string }) => {
  const { data, filename } = params;
  const el = document.createElement('a');
  el?.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
  el?.setAttribute('download', filename);
  el?.click();
  el?.remove();
};