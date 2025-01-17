import { AuthState, OAuthToken } from './model';
import { ACTION_TYPES } from './actionTypes';
import {createReducer} from "@/app-redux/config";
// Constants
import {SCOPE} from "@/utils/config/base";

export interface loginPayload{
  scope : SCOPE | null;
  token : OAuthToken;
}
type Payload = string | undefined | string[] | loginPayload | OAuthToken;

const initialState: AuthState = {
  error: null,
  loading: false,
  token: null,
  scope: null
};

const reducerState = {
  //GET_OAUTH_TOKEN
  [ACTION_TYPES.GET_OAUTH_TOKEN]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.GET_OAUTH_TOKEN_SUCCESS]: (state: AuthState, payload: loginPayload) => ({
    ...state,
    error: null,
    loading: false,
    token: payload.token,
    scope: payload.scope
  }),
  [ACTION_TYPES.GET_OAUTH_TOKEN_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    error: payload as string,
    loading: false,
    token: null,
  }),

  //AUTH_REGISTER
  [ACTION_TYPES.AUTH_REGISTER]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.AUTH_REGISTER_SUCCESS]: (state: AuthState, payload: loginPayload) => ({
    ...state,
    error: null,
    loading: false,
    token: payload.token,
    scope: payload.scope
  }),
  [ACTION_TYPES.AUTH_REGISTER_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    error: payload as string,
    loading: false,
  }),

  //AUTH_LOGIN
  [ACTION_TYPES.AUTH_LOGIN]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.AUTH_LOGIN_SUCCESS]: (state: AuthState, payload: loginPayload) => ({
    ...state,
    loading: false,
    token: payload.token,
    scope: payload.scope
  }),
  [ACTION_TYPES.AUTH_LOGIN_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    error: payload as string,
    loading: false,
  }),

  //AUTH_VERIFICATION_EMAIL
  [ACTION_TYPES.AUTH_VERIFICATION_EMAIL]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.AUTH_VERIFICATION_EMAIL_SUCCESS]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: false,
  }),
  [ACTION_TYPES.AUTH_VERIFICATION_EMAIL_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    error: payload as string,
    loading: false,
  }),

  //RESEND_VERIFICATION_EMAIL
  [ACTION_TYPES.RESEND_VERIFICATION_EMAIL]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.RESEND_VERIFICATION_EMAIL_SUCCESS]: (state: AuthState) => ({
    ...state,
    loading: false,
    error: null
  }),
  [ACTION_TYPES.RESEND_VERIFICATION_EMAIL_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    loading: false,
    error: payload as string
  }),

  //RESET_PASS_EMAIL
  [ACTION_TYPES.RESET_PASS_EMAIL]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.RESET_PASS_EMAIL_SUCCESS]: (state: AuthState) => ({
    ...state,
    loading: false,
    error: null
  }),
  [ACTION_TYPES.RESET_PASS_EMAIL_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    loading: false,
    error: payload as string
  }),

  //RESET_PASS_UPDATE
  [ACTION_TYPES.RESET_PASS_UPDATE]: (state: AuthState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.RESET_PASS_UPDATE_SUCCESS]: (state: AuthState) => ({
    ...state,
    loading: false,
    error: null
  }),
  [ACTION_TYPES.RESET_PASS_UPDATE_ERROR]: (state: AuthState, payload: Payload) => ({
    ...state,
    loading: false,
    error: payload as string
  }),

  //LOGOUT
  [ACTION_TYPES.LOGOUT]: () => ({
    ...initialState,
  }),
};

const reducer = createReducer<AuthState,Payload>(initialState, reducerState);
export default reducer;
