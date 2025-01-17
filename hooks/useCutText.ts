/**
 * Cut text string
 * @param string
 * @param qty_symbols
 */
export const useCutText = (string: string, qty_symbols: number) => {
  if(!string) return '';
  let cuttedString = string.replace(/<[^>]+>/g, '');

  if(cuttedString?.length > qty_symbols) {
    cuttedString = cuttedString.substring(0, qty_symbols);
    cuttedString += '...';
  }

  return cuttedString;
};
