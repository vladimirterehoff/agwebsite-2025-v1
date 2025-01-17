import { crudActionTypes } from '../COMMON/crud';
/**
 * Action Types for dispatch of Static Pages state
 */
export const  ACTION_TYPES  = {...{
    GET_STATIC_PAGE_API           : `GET_STATIC_PAGE_API`,
    GET_STATIC_PAGE_API_SUCCESS     : `GET_STATIC_PAGE_API_SUCCESS`,
    GET_STATIC_PAGE_API_ERROR     : `GET_STATIC_PAGE_API_ERROR`,
  },...crudActionTypes('STATIC_PAGES')};

