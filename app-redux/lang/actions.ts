import { ACTION_TYPES } from "./actionTypes";
import { Lang } from "./model";
import { dispatch } from '@/app-redux/config';
import { AppState } from '@/app-redux/state';
// Services
import {setLang} from "@/services/lang";

/**
 * Lang Actions
 */
export const langActions = {
    onChangeLang: (lang: Lang | null, ssrStore? : AppState) => {
      dispatch({type: ACTION_TYPES.CHANGE_LANG, payload: lang}, ssrStore);
      lang && setLang(lang.code);
    }
}