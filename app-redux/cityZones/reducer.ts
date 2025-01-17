import { ACTION_TYPES  } from './actionTypes';
import { CityZone, CityZonesState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | CityZone | CityZone[] ;

const initialState: CityZonesState = {
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

const reducer = createReducer<CityZonesState,Payload>(initialState, reducerState);
export default reducer;
