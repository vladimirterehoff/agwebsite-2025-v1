import { ACTION_TYPES  } from './actionTypes';
import { StaticPage, StaticPageState} from './model';
import { createReducer } from "@/app-redux/config";
import { crudReducer } from "../COMMON/crud";

type Payload = undefined | string | StaticPage | StaticPage[] ;

const initialState: StaticPageState = {
  pagination: null,
  loading: false,
  error: null,
  list: [],
  data: null,
};

const reducerState = { ...{
    [ACTION_TYPES.GET_STATIC_PAGE_API]: (state: StaticPageState) => ({
      ...state,
      loading: true,
      error: null
    }),
    [ACTION_TYPES.GET_STATIC_PAGE_API_ERROR]: (state: StaticPageState, payload: Payload) => ({
      ...state,
      loading: false,
      error: payload as string
    }),
    [ACTION_TYPES.GET_STATIC_PAGE_API_SUCCESS]: (state: StaticPageState, payload : Payload) => ({
      ...state,
      loading: false,
      data: payload as StaticPage,
      error: null
    })
  },
  ... crudReducer(ACTION_TYPES)
};

const reducer = createReducer<StaticPageState,Payload>(initialState, reducerState);
export default reducer;
