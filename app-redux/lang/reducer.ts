import {ACTION_TYPES} from "./actionTypes";
import {createReducer} from "@/app-redux/config";
import {Lang, LangState} from "./model";

type Payload = undefined | string | Lang[];

const initialState: LangState = {
  selected_lang: null
}

const reducerState = {
    [ACTION_TYPES.CHANGE_LANG]: (state: LangState, payload: Lang | null) => ({
      selected_lang: payload
    }),
}

const reducer = createReducer<LangState, Payload>(initialState, reducerState)

export default reducer
