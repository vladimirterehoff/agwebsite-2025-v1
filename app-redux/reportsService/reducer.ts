import { ACTION_TYPES  } from './actionTypes';
import { ServiceReport, ServiceReportsState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | ServiceReport | ServiceReport[] ;

const initialState: ServiceReportsState = {
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

const reducer = createReducer<ServiceReportsState,Payload>(initialState, reducerState);
export default reducer;
