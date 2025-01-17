// Libs
import Cookies from "js-cookie";
// Redux
import { OAuthToken } from '@/app-redux/auth/model';
// Constants
import { SCOPE } from "@/utils/config/base";
import { TOKEN_PREFIX as ADMIN_TOKEN_PREFIX } from "@/utils/config/admin";
import { TOKEN_PREFIX as SITE_TOKEN_PREFIX } from "@/utils/config/site";

/*токен может быть двух видов - клиентский (clientToken) или пользовательский(userToken)
клиентский - это токен подписывающий, что конкретное устройство может делать запросы
пользовательский - тот же клиентский, но конкретный девайс подписан еще и юзером*/

const getTokenPrefix = (scope: SCOPE) => {
  return scope == SCOPE.SITE? SITE_TOKEN_PREFIX : ADMIN_TOKEN_PREFIX;
}

/**
 * Set Client Token
 * @param token
 * @param scope
 */
export const setClientToken = (token: OAuthToken, scope: SCOPE): void => {
  Cookies.set(
      `${getTokenPrefix(scope)}_clientToken`,
      token.access_token,
      { expires: Number(token.expires_in)/86400, path : '/'}
  );
};

/**
 * Get Client Token
 * @param scope
 */
export const getClientToken = (scope: SCOPE): string | null => {
  const token =  Cookies.get(`${getTokenPrefix(scope)}_clientToken`);
  if (!token) return null;
  return token;
};

/**
 * Clear Client Token
 * @param scope
 */
export const clearClientToken = (scope: SCOPE) => {
  Cookies.remove(`${getTokenPrefix(scope)}_clientToken`);
};

/**
 * Set User Token
 * @param token
 * @param scope
 */
export const setUserToken = (token: OAuthToken, scope: SCOPE): void => {
  Cookies.set(
      `${getTokenPrefix(scope)}_userToken`,
      token.access_token,
      { expires: Number(token.expires_in)/86400, path : '/'}
  );
};

/**
 * Get User Token
 * @param scope
 */
export const getUserToken = (s: SCOPE): string | null => {
  const scope = s ? s : SCOPE.ADMIN;
  const token =  Cookies.get(`${getTokenPrefix(scope)}_userToken`);
  if (!token) return null;
  return token;
};

/**
 * Clear User Token
 * @param scope
 */
export const clearUserToken = (scope: SCOPE) => {
  Cookies.remove(`${getTokenPrefix(scope)}_userToken`);
};

/**
 * Set Authorization Header
 * @param token
 */
export const authorizationHeader = (token?: string) => {
  let headers = {};
  if(token){
    headers = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }
  return headers;
}