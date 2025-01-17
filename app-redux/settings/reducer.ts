import { ACTION_TYPES  } from './actionTypes';
import { Setting, SettingState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Setting | Setting[] ;

const initialState: SettingState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
};

const reducerState = {
  ... crudReducer<Setting, SettingState>(ACTION_TYPES)
};

const reducer = createReducer<SettingState,Payload>(initialState, reducerState);
export default reducer;
