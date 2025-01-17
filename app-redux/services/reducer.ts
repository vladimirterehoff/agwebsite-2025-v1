import { ACTION_TYPES  } from './actionTypes';
import { Service, ServicesState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Service | Service[] ;

const initialState: ServicesState = {
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

const reducer = createReducer<ServicesState,Payload>(initialState, reducerState);
export default reducer;
