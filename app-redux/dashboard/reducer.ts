import { ACTION_TYPES  } from './actionTypes';
import { OrdersGraph, OrdersGraphState } from './model';
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | OrdersGraph | OrdersGraph[] ;

const initialState: OrdersGraphState = {
  loading: false,
  error: null,
  data: [],
};

const reducerState = {[ACTION_TYPES.GET_ORDERS_GRAPH]: (state: OrdersGraphState) => ({
    ...state,
    error: null,
    loading: true
  }),
  [ACTION_TYPES.GET_ORDERS_GRAPH_SUCCESS]: (state: OrdersGraphState, payload: Payload) => ({
    ...state,
    error: null,
    loading: false,
    data: payload,
  }),
  [ACTION_TYPES.GET_ORDERS_GRAPH_ERROR]: (state: OrdersGraphState, payload: Payload) => ({
    ...initialState,
    error: payload as string,
  }),
};

const reducer = createReducer<OrdersGraphState,Payload>(initialState, reducerState);
export default reducer;
