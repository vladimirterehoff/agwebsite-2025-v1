import { ACTION_TYPES  } from './actionTypes';
import { VehicleType, VehicleTypesState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | VehicleType | VehicleType[] ;

const initialState: VehicleTypesState = {
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

const reducer = createReducer<VehicleTypesState,Payload>(initialState, reducerState);
export default reducer;
