import { ACTION_TYPES  } from './actionTypes';
import { CrudExampleModel, CrudExampleState } from './model';
import { crudReducer } from '@/app-redux/COMMON/crud';
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | CrudExampleModel | CrudExampleModel[] ;

const initialState: CrudExampleState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
};

const reducerState = { ...{
    //add reducer for custom action types
  },
  ... crudReducer<CrudExampleModel, CrudExampleState>(ACTION_TYPES)
};

const reducer = createReducer<CrudExampleState,Payload>(initialState, reducerState);
export default reducer;
