import { ACTION_TYPES  } from './actionTypes';
import { User, UsersState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | User | User[] ;

const initialState: UsersState = {
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

const reducer = createReducer<UsersState,Payload>(initialState, reducerState);
export default reducer;
