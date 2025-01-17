import { ACTION_TYPES  } from './actionTypes';
import { Vehicle, VehiclesState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Vehicle | Vehicle[] ;

const initialState: VehiclesState = {
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

const reducer = createReducer<VehiclesState,Payload>(initialState, reducerState);
export default reducer;
