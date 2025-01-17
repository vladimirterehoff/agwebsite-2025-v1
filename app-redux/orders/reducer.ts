import { ACTION_TYPES  } from './actionTypes';
import { Order, OrdersState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";
import { Action } from '@reduxjs/toolkit';

type Payload = undefined | string | Order | Order[] | number;

const initialState: OrdersState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
  refundableNumber: 0,
};

const reducerState = {
  ...crudReducer(ACTION_TYPES),

  // Refund
  [ACTION_TYPES.REFUND]: (state: OrdersState) => {
    return { ...state, loading: true };
  },
  [ACTION_TYPES.REFUND_SUCCESS]: (state: OrdersState) => {
    return { ...state, loading: false };
  },
  [ACTION_TYPES.REFUND_FAILED]: (state: OrdersState) => {
    return { ...state, loading: false };
  },

  // Send Money to Provider
  [ACTION_TYPES.SEND_MONEY]: (state: OrdersState) => {
    return { ...state, loading: true };
  },
  [ACTION_TYPES.SEND_MONEY_SUCCESS]: (state: OrdersState) => {
    return { ...state, loading: false };
  },
  [ACTION_TYPES.SEND_MONEY_FAILED]: (state: OrdersState) => {
    return { ...state, loading: false };
  },

  // Get Refundable Number
  [ACTION_TYPES.GET_REFUNDABLE_NUMBER]: (state: OrdersState) => {
    return { ...state };
  },
  [ACTION_TYPES.GET_REFUNDABLE_NUMBER_SUCCESS]: (state: OrdersState, payload: number) => {
    return { ...state, refundableNumber: payload };
  },
  [ACTION_TYPES.GET_REFUNDABLE_NUMBER_FAILED]: (state: OrdersState) => {
    return { ...state, refundableNumber: 0 };
  },

};

const reducer = createReducer<OrdersState,Payload>(initialState, reducerState);
export default reducer;
