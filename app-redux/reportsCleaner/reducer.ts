import { ACTION_TYPES  } from './actionTypes';
import { CleanerReport, CleanerReportsState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | CleanerReport | CleanerReport[] ;

const initialState: CleanerReportsState = {
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

const reducer = createReducer<CleanerReportsState,Payload>(initialState, reducerState);
export default reducer;
