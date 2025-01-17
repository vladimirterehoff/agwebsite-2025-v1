import {Pagination} from "../model/pagination";

export function crudReducer<T, TS>(crudActionTypes : any) {
  type GetListPayload = {
    meta: Pagination | null;
    data: T[] | [];
  }
  type Payload = string | undefined | string[] | T | GetListPayload;

  return {
    // GET LIST
    [crudActionTypes.GET_LIST]: (state: TS) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [crudActionTypes.GET_LIST_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      pagination : null,
      loading: false,
      error: payload,
      list: [],
    }),
    [crudActionTypes.GET_LIST_SUCCESS]: (state: TS, payload : Payload) => ({
      ...state,
      pagination : (payload as GetListPayload).meta,
      loading: false,
      error: null,
      list: (payload as GetListPayload).data,
    }),

    // GET DATA
    [crudActionTypes.GET]: (state: T): T => ({
      ...state,
      loading: true,
      error: null,
    }),
    [crudActionTypes.GET_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload,
      data: null
    }),
    [crudActionTypes.GET_SUCCESS]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: null,
      data: payload,
    }),

    // ADD
    [crudActionTypes.ADD]: (state: TS) => ({
      ...state,
      loading: true,
      error: null,
      data: null
    }),
    [crudActionTypes.ADD_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload,
      data: null
    }),
    [crudActionTypes.ADD_SUCCESS]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: null,
      data: payload,
    }),

    // UPDATE
    [crudActionTypes.UPDATE]: (state: TS) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [crudActionTypes.UPDATE_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [crudActionTypes.UPDATE_SUCCESS]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: null,
      data: payload,
    }),

    // DELETE
    [crudActionTypes.DELETE]: (state: TS) => ({
      ...state,
      loading: true,
      error: null
    }),
    [crudActionTypes.DELETE_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [crudActionTypes.DELETE_SUCCESS]: (state: TS) => ({
      ...state,
      loading: false,
      error: null,
      data: null,
    }),

    // ACTIVATE
    [crudActionTypes.ACTIVATE]: (state: TS) => ({
      ...state,
      loading: true,
      error: null
    }),
    [crudActionTypes.ACTIVATE_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [crudActionTypes.ACTIVATE_SUCCESS]: (state: TS) => ({
      ...state,
      loading: false,
      error: null,
    }),

    // DEACTIVATE
    [crudActionTypes.DEACTIVATE]: (state: TS) => ({
      ...state,
      loading: true,
      error: null
    }),
    [crudActionTypes.DEACTIVATE_ERROR]: (state: TS, payload : Payload) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [crudActionTypes.DEACTIVATE_SUCCESS]: (state: TS) => ({
      ...state,
      loading: false,
      error: null,
    }),

    // CLEAR
    [crudActionTypes.CLEAR_DATA]: (state: TS) => ({
      ...state,
      data: null,
      list: [],
      loading: false,
      error: null,
    }),
    [crudActionTypes.CLEAR_LIST]: (state: TS) => ({
      ...state,
      list: [],
      loading: false,
      error: null,
    })
  };
};
