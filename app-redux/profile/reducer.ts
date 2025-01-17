import { ProfileState } from './model';
import { User } from '../users/model';
import { createReducer } from '@/app-redux/config';
import {ACTION_TYPES} from './actionTypes';

type Payload = string | undefined | string[] | User;

const initialState: ProfileState = {
  error: null,
  loading: false,
  profile: null,
  email_verified_at: false,
  permissions:[]
};

const reducerState = {
  [ACTION_TYPES.GET_PROFILE]: (state: ProfileState) => ({
    ...state,
    error: null,
    loading: true
  }),
  [ACTION_TYPES.GET_PROFILE_SUCCESS]: (state: ProfileState, payload: Payload) => ({
    ...state,
    error: null,
    loading: false,
    profile:payload,
    permissions:(payload as User).permissions,
    email_verified_at:!!(payload as User)?.email_verified_at,
  }),
  [ACTION_TYPES.GET_PROFILE_ERROR]: (state: ProfileState, payload: Payload) => ({
    ...initialState,
    error: payload as string,
  }),
  [ACTION_TYPES.UPDATE_PROFILE]: (state: ProfileState) => ({
    ...state,
    error: null,
    loading: true,
  }),
  [ACTION_TYPES.UPDATE_PROFILE_SUCCESS]: (state: ProfileState, payload: any) => {
    let user = {...state.profile, ...payload};

    return {
      ...state,
      error: null,
      loading: false,
      profile: user
    }
  },
  [ACTION_TYPES.UPDATE_PROFILE_ERROR]: (state: ProfileState, payload: Payload) => {
    return {
      ...state,
      error: payload as string,
      loading: false,
    }
  },

  [ACTION_TYPES.CLEAN_PROFILE]: (state: ProfileState) => {
    return {
      ...state,
      error: null,
      loading: false,
      profile: null
    }
  }
};

const reducer = createReducer<ProfileState,Payload>(initialState, reducerState);

export default reducer;
