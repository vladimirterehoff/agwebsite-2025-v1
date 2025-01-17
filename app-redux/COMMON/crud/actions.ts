import api from '@/services/axios';
import {dispatch} from '@/app-redux/config';

/**
 * Default CRUD Actions
 */
export function crudActions<T>(url: string ,
                               actionTypes: any,
                               normalizeData ? : (data : any)=>void ){

  /**
   * Get list of objects or single object
   * @param id
   * @param params
   */
  const getAction = async (id: string | number | null = null, params = '') => {
    //Get single object
    if(id){
      try {
        dispatch({type: actionTypes.GET});
        const response = await api.get<void>(`${url}/${id}?${params}`);
        let data: any = response.data;
        if (normalizeData) data = normalizeData(data);
        dispatch({type: actionTypes.GET_SUCCESS, payload: data});
        return data;
      }
      catch(error : any){
        dispatch({ type: actionTypes.GET_ERROR,payload: error.message,});
        throw error;
      }
    }
    //Get list of objects
    else{
      try {
        dispatch({type: actionTypes.GET_LIST});
        const response = await api.get<void>(`${url}?${params}`);
        const data = response.data;
        dispatch({type: actionTypes.GET_LIST_SUCCESS, payload: response});
        return data;
      }
      catch(error : any){
        dispatch({type: actionTypes.GET_LIST_ERROR,payload: error.message,});
        throw error;
      }
    }
  };

  /**
   * Delete object
   * @param id
   */
  const deleteAction = async (id : number) => {
    try {
      dispatch({type: actionTypes.DELETE});
      const response = await api.delete<any>(`${url}/${id}`);
      dispatch({type: actionTypes.DELETE_SUCCESS});
      return;
    }
    catch(error : any) {
      dispatch({type: actionTypes.DELETE_ERROR,payload: error.message });
      throw error;
    }
  };

  /**
   * Activate object
   * @param id
   */
  const activateAction = async (id : number) => {
    try {
      dispatch({type: actionTypes.ACTIVATE});
      const response = await api.put<any>(`${url}/${id}/activate`);
      dispatch({type: actionTypes.ACTIVATE_SUCCESS});
      return;
    }
    catch(error : any) {
      dispatch({type: actionTypes.ACTIVATE_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Activate object
   * @param id
   */
  const deactivateAction = async (id : number) => {
    try {
      dispatch({type: actionTypes.DEACTIVATE});
      const response = await api.put<any>(`${url}/${id}/deactivate`);
      dispatch({type: actionTypes.DEACTIVATE_SUCCESS});
      return;
    }
    catch(error : any) {
      dispatch({type: actionTypes.DEACTIVATE_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Create object
   * @param form
   */
  const postAction = async (form: T ) => {
    try {
      dispatch({type: actionTypes.ADD});
      const response = await api.post<any>(`${url}`, {...form});
      const data = response.data;
      dispatch({type: actionTypes.ADD_SUCCESS, payload: data});
      return data;
    }
    catch(error : any){
      dispatch({ type: actionTypes.ADD_ERROR,payload: error.message, });
      throw error;
    }
  };

  /**
   * Update object
   * @param form
   */
  const putAction = async (form: T | any) => {
    try {
      dispatch({type: actionTypes.UPDATE});
      const id = form.id;
      const response = await api.put<any>(`${url}/${id}`, {...form});
      const data = response.data;
      dispatch({type: actionTypes.UPDATE_SUCCESS, payload: data});
      return data;
    }
    catch(error : any){
      dispatch({ type: actionTypes.UPDATE_ERROR ,payload: error.message,});
      throw error;
    }
  };

  /**
   * Submit crud form - create or update object
   * @param form
   */
  const submitAction = (form : any) => {
    if(form.id) {
      return putAction(form)
    } else {
      return postAction(form)
    }
  };

  /**
   * Clear data of the single object from the store
   */
  const clearDataAction = () => {
    dispatch({type: actionTypes.CLEAR_DATA});
  };

  /**
   * Clear list of objects from the store
   */
  const clearListAction = () => {
    dispatch({type: actionTypes.CLEAR_LIST});
  };

  return {
    get: getAction,
    delete : deleteAction,
    activate: activateAction,
    deactivate: deactivateAction,
    submit : submitAction,
    clearData : clearDataAction,
    clearList : clearListAction
  };
};
