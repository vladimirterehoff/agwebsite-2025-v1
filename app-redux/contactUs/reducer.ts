import { ACTION_TYPES } from './actionTypes';
import { ContactUs, ContactUsState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";
import { AnyAction } from 'redux';

type Payload = undefined | string | ContactUs | ContactUs[];

const initialState: ContactUsState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
  loadingOptions: false,
  options: [],
};

const reducerState = {
  ...crudReducer<ContactUs, ContactUsState>(ACTION_TYPES),
  [ACTION_TYPES.GET_OPTIONS]: (state: ContactUsState) => ({
    ...state,
    loadingOptions: true,
  }),
  [ACTION_TYPES.GET_OPTIONS_SUCCESS]: (state: ContactUsState, payload: AnyAction) => {
    console.log('>> payload', payload);
    return {
      ...state,
      options: payload,
      loadingOptions: false,
    };
  },
  [ACTION_TYPES.GET_OPTIONS_ERROR]: (state: ContactUsState) => ({
    ...state,
    options: [],
    loadingOptions: false,
  }),
};

const reducer = createReducer<ContactUsState,Payload>(initialState, reducerState);
export default reducer; 