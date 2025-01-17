import { ACTION_TYPES  } from './actionTypes';
import { Review, ReviewsState as ReviewsState } from './model';
import { crudReducer } from "../COMMON/crud";
import { createReducer } from "@/app-redux/config";

type Payload = undefined | string | Review | Review[] ;

const initialState: ReviewsState = {
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

const reducer = createReducer<ReviewsState,Payload>(initialState, reducerState);
export default reducer;
