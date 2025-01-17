import {dispatch} from '@/app-redux/config';
import {AppState} from '@/app-redux/state';
import {profileActions} from '@/app-redux/profile/actions';
import {ACTION_TYPES} from './actionTypes';
import {OAuthToken} from './model';
// Services
import { setClientToken,  setUserToken,  clearClientToken, clearUserToken} from '@/services/token';
import api from '@/services/axios';
// Constants
import { SCOPE} from '@/utils/config/base';
import { OAUTH_URL, AUTH_URL ,CLIENT_ID, CLIENT_SECRET } from '@/utils/envirenment';

/**
 * Auth Actions
 */
export const authActions = {
  /**
   * Get client token
   * @param scope
   * @param ssrStore
   */
  getAuthToken: async (scope: SCOPE = SCOPE.SITE, ssrStore?: AppState) => {
    try {
      dispatch({type: ACTION_TYPES.GET_OAUTH_TOKEN}, ssrStore);
      const req_data = {
        grant_type: 'client_credentials',
        client_id: Number(CLIENT_ID),
        client_secret: CLIENT_SECRET,
        scopes: [scope],
      };
      const response: any = await api.post(`${OAUTH_URL}/token`, JSON.stringify(req_data));
      const token: OAuthToken = {
        access_token: response.access_token,
        expires_in: response.expires_in,
      };
      setClientToken(token, scope);

      dispatch({type: ACTION_TYPES.GET_OAUTH_TOKEN_SUCCESS, payload: {token, scope: scope}}, ssrStore);
      return Promise.resolve(token);
    } catch (error: any) {
      dispatch({type: ACTION_TYPES.GET_OAUTH_TOKEN_ERROR, payload: error?.message}, ssrStore);
      return Promise.reject(error);
    }
  },

  /**
   * Login action
   * @param formData - data of Login Form
   * @param scope
   */
  login : async (formData: object, scope: SCOPE = SCOPE.SITE) => {
    try {
      dispatch({type: ACTION_TYPES.AUTH_LOGIN});
      const response: any = await api.post(`${AUTH_URL}/login`, formData);
      const user = response.data;
      const token: OAuthToken = {
        access_token: response.oauth.access_token,
        expires_in: response.oauth.expires_in,
      };

      setUserToken(token, scope);
      clearClientToken(scope);
      await dispatch({type: ACTION_TYPES.AUTH_LOGIN_SUCCESS, payload: {token, scope: scope}});

      await profileActions.getProfile(undefined, scope);
      return Promise.resolve(user);
    }
    catch (error : any) {
      dispatch({ type: ACTION_TYPES.AUTH_LOGIN_ERROR, payload: error?.message});
      return Promise.reject(error);
    }
  },

  /**
   * Registration action
   * @param formData - data of registration form
   * @param scope
   */
  register: async (formData: object, scope: SCOPE = SCOPE.SITE) => {
    try {
      dispatch({type: ACTION_TYPES.AUTH_REGISTER});
      const response: any = await api.post<any>(`${AUTH_URL}/register`, formData);
      const data = response.data;
      const token: OAuthToken = {
        access_token: response.oauth.access_token,
        expires_in: response.oauth.expires_in,
      };

      setUserToken(token, scope);
      clearClientToken(scope);
      await dispatch({type: ACTION_TYPES.AUTH_REGISTER_SUCCESS, payload: {token, scope: scope}});

      await profileActions.getProfile(undefined, scope);
      return Promise.resolve(data);
    } catch (error: any) {
      dispatch({type: ACTION_TYPES.AUTH_REGISTER_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  /**
   * Verification Email action
   * @param formData - data with email and token
   */
  verificationEmail:async (formData: object) => {
    try {
      dispatch({ type: ACTION_TYPES.AUTH_VERIFICATION_EMAIL });
      const response = await api.post(`${AUTH_URL}/verification/email`, formData);
      const data = response.data;
      dispatch({ type: ACTION_TYPES.AUTH_VERIFICATION_EMAIL_SUCCESS});
      return Promise.resolve(data);
    }
    catch (error : any) {
      dispatch({ type: ACTION_TYPES.AUTH_VERIFICATION_EMAIL_ERROR, payload: error.message });
      return Promise.reject(error);
    }
  },

  /**
   * Resend Verification message to email
   * @param formData - email
   */
  resendVerificationEmail:async (formData: object) => {
    try {
      dispatch({type: ACTION_TYPES.RESEND_VERIFICATION_EMAIL});
      const response = await api.post(`${AUTH_URL}/verification/resend`, formData);
      const data = response.data;
      dispatch({ type: ACTION_TYPES.RESEND_VERIFICATION_EMAIL_SUCCESS});
      return Promise.resolve(data);
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.RESEND_VERIFICATION_EMAIL_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  /**
   * Send link for reset password to the email
   * @param formData -  email
   * @param scope
   */
  resetPassEmail: async (formData: object, scope: SCOPE = SCOPE.SITE) => {
    try{
      dispatch({type: ACTION_TYPES.RESET_PASS_EMAIL});
      const response = await api.post(`${AUTH_URL}/password/forgot`,
        { ...formData, ...{ side: scope == SCOPE.SITE ? 'frontend' : 'backend' } });
      dispatch({ type: ACTION_TYPES.RESET_PASS_EMAIL_SUCCESS});
      return Promise.resolve();
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.RESET_PASS_EMAIL_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  /**
   * Update password action
   * @param formData - data with new password
   */
  resetPassUpdate: async (formData: object) => {
    try{
      dispatch({type: ACTION_TYPES.RESET_PASS_UPDATE});
      const response = await api.post(`${AUTH_URL}/password/reset`, formData);
      dispatch({ type: ACTION_TYPES.RESET_PASS_UPDATE_SUCCESS});
      return Promise.resolve();
    }
    catch (error : any) {
      dispatch({type: ACTION_TYPES.RESET_PASS_UPDATE_ERROR, payload: error.message});
      return Promise.reject(error);
    }
  },

  /**
   * Logout from the system
   * @param scope
   */
  logout:async (scope: SCOPE = SCOPE.SITE) => {
    clearClientToken(scope);
    clearUserToken(scope);
    dispatch({ type: ACTION_TYPES.LOGOUT });
    await profileActions.clearProfile()
    await authActions.getAuthToken(scope);
    return Promise.resolve();
  }
};
