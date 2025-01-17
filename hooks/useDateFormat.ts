import moment from "moment";

const BACKEND_DATE_FORMAT = 'DD-MM-YYYY';
const DATE_FORMAT = 'DD.MM.YYYY';
const DATE_AND_TIME_FORMAT = 'DD.MM.YYYY HH:mm';

/**
 * Work with dates
 */
export const useDateFormat = () => {

  /**
   * Convert Date from datepicker to the Backend format
   * @param date
   * @param format
   */
  const toBEDate = (date: string, format? : string) => {
    const dateFormat = format || BACKEND_DATE_FORMAT;
    return moment(date).format(dateFormat);
  }

  /**
   * Convert TimeStamp date format to the date string format
   * @param date
   * @param format
   */
  const toDate = (date: number, format? : string) => {
    const dateFormat = format || DATE_FORMAT;
    const _date = String(date).length <= 10 ? date * 1000 :date;
    return moment(_date).format(dateFormat);
  }

  /**
   * Convert TimeStamp date format to the date  and time string format
   * @param date
   * @param format
   */
  const toDateTime = (date: number, format? : string) => {
    const dateFormat = format || DATE_AND_TIME_FORMAT;
    const _date = String(date).length <= 10 ? date * 1000 :date;
    return moment(_date).format(dateFormat);
  }

  /**
   * Convert TimeStamp date format to the Date string
   * @param date
   */
  const toFullDateString = (date: number) => {
    const _date = String(date).length <= 10 ? date * 1000 :date;
    return moment(_date).toDate();
  }

  /**
   * Convert date string to the timeStamp
   * @param date
   */
  const toTimeStamp = (date: string | number) => {
    const _date = new Date(date).getTime();
    return  String(_date).length >10 ? _date / 1000 : _date;
  }

  return {
    toBEDate,
    toDate,
    toDateTime,
    toFullDateString,
    toTimeStamp
  }
};
