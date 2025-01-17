/**
 * Default Action Types for CRUDs
 */
export const crudActionTypes = (name:string) : any => {
  return {
    GET_LIST           : `${name}_GET_LIST`,
    GET_LIST_ERROR     : `${name}_GET_LIST_ERROR`,
    GET_LIST_SUCCESS   : `${name}_GET_LIST_SUCCESS`,

    GET                : `${name}_GET`,
    GET_ERROR          : `${name}_GET_ERROR`,
    GET_SUCCESS        : `${name}_GET_SUCCESS`,

    ADD                : `${name}_ADD`,
    ADD_ERROR          : `${name}_ADD_ERROR`,
    ADD_SUCCESS        : `${name}_ADD_SUCCESS`,

    UPDATE             : `${name}_UPDATE`,
    UPDATE_ERROR       : `${name}_UPDATE_ERROR`,
    UPDATE_SUCCESS     : `${name}_UPDATE_SUCCESS`,

    DELETE             : `${name}_DELETE`,
    DELETE_ERROR       : `${name}_DELETE_ERROR`,
    DELETE_SUCCESS     : `${name}_DELETE_SUCCESS`,

    ACTIVATE           : `${name}_ACTIVATE`,
    ACTIVATE_ERROR     : `${name}_ACTIVATE_ERROR`,
    ACTIVATE_SUCCESS   : `${name}_ACTIVATE_SUCCESS`,
    
    DEACTIVATE         : `${name}_DEACTIVATE`,
    DEACTIVATE_ERROR   : `${name}_DEACTIVATE_ERROR`,
    DEACTIVATE_SUCCESS : `${name}_DEACTIVATE_SUCCESS`,

    CLEAR_DATA         : `${name}_CLEAR_DATA`,
    CLEAR_LIST         : `${name}_CLEAR_LIST`,
  }
};
