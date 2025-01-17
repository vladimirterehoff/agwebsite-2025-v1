import Cookies from "js-cookie";

/**
 * Set Lang to the cookie
 * @param lang
 */
export const setLang = (lang: string)  => {
  Cookies.set('NEXT_LOCALE', lang,{ path : '/'});
};

/**
 * Get Lang from the cookie
 */
export const getLang = () => {
  return Cookies.get('NEXT_LOCALE') ? Cookies.get('NEXT_LOCALE') : null;
};

/**
 * Clear lang cookie
 */
export const clearLang = () => {
  Cookies.remove('NEXT_LOCALE');
};