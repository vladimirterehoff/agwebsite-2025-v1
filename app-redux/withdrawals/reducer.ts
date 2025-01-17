import { ACTION_TYPES  } from './actionTypes';
import { Withdrawal, WithdrawalsState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Withdrawal | Withdrawal[] ;

const initialState: WithdrawalsState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
};

const reducerState = { ...{
    // Reducer for custom action types
  },
  ... crudReducer(ACTION_TYPES)
};

const reducer = createReducer<WithdrawalsState,Payload>(initialState, reducerState);
export default reducer;
