import { ACTION_TYPES  } from './actionTypes';
import { Provider, ProvidersState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Provider | Provider[] ;

const initialState: ProvidersState = {
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

const reducer = createReducer<ProvidersState,Payload>(initialState, reducerState);
export default reducer;
