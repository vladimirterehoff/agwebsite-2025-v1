import { ACTION_TYPES  } from './actionTypes';
import { RolesState, Role } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Role | Role[] ;

const initialState: RolesState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
};

const reducerState = {
  ... crudReducer(ACTION_TYPES)
};

const reducer = createReducer<RolesState,Payload>(initialState, reducerState);
export default reducer;
