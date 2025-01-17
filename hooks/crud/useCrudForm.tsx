// Libs
import React, { useState } from 'react';
import { useRouter } from 'next/router';
// Hooks
import { useRequestErrors } from '@/hooks/useRequestErrors';
// Helpers
import { FilterService } from '@/helpers/filterService/index';

interface BaseFormType {
  id:number,
  non_field_error : string
}

/**
 * CRUD Form helper
 * @param actions - actions of the crud from app-redux
 * @param formHook
 * @param urlSlug - slug of the list page
 */
export const useCrudForm  = function useCrudFN<T extends BaseFormType>(actions: any, formHook:any, urlSlug:string, normalizeGetData?: (data: any) => void){
  const [filter] = useState(new FilterService());
  const [id, setId] = useState<number | null>(null);
  const {setError, setValue, reset, trigger} = formHook;
  const { push } = useRouter();
  const { requestError } = useRequestErrors();

  /**
   * Get Data
   * @param idItem
   */
  const getData =  async (idItem : number | undefined | 'undefined') => {
    if(idItem && idItem!=undefined && idItem!='undefined') {
      setId(idItem);
      try{
          const data = await actions.get(idItem, filter.filter);
          updateValues(data);
      }
      catch (e) { }
    }
  };

  /**
   * Update values of the form
   * @param data
   */
  const updateValues = (data : any) =>{
    reset(normalizeGetData? normalizeGetData(data) : data);
    /*Object.keys(data).forEach((key)=>{
      console.log('key:', key, '||| val:', data[key])
      setValue(key, data[key])
    });*/
  };

  /**
   * Submit form
   * @param data
   */
  const onSubmit = async (data: T) => {
    const { non_field_error, ...formVal } = data;
    if(id) formVal['id'] = id;
    try{
      await actions.submit(formVal)
      push(urlSlug);
    }
    catch (errors: any) {
      requestError(errors, setError)
      throw errors;
    }
  };

  return {getData : getData,onSubmit : onSubmit, filter : filter};
};
