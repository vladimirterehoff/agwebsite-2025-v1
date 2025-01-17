import { ACTION_TYPES  } from './actionTypes';
import { City, CitiesState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | City | City[] ;

const initialState: CitiesState = {
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

const reducer = createReducer<CitiesState,Payload>(initialState, reducerState);
export default reducer;
