import {ERRORS, ERRORS_TYPES} from 'utils/errors'
import {notify} from 'helpers/notify';
import {sendApiErrorLog} from 'helpers/logs';
import { ErrorModel } from "app-redux/COMMON/crud/model";

const DEFAULT_MESSAGE = 'Oops something went wrong.'

export const useRequestErrors = () => {
    const requestError: any = async(e: any, setError?: any) => {
        
        const errorsHandler = () => {
            // console.log('>> >> action', action)
            let errorsNotifyList: string[] = []
            e?.errors && e.errors.forEach((error: ErrorModel) => {
                error.errors.forEach((message: string) => {
                    
                    if (message == 'The user credentials were incorrect.' && `${error.field}` == 'non_field_error')
                    message = 'The entered password is not correct, please try again';
                    
                    setError?.(`${error?.field}`, { message });
                    errorsNotifyList.push(message)
                    
                });
            });
            notify.error(errorsNotifyList);
        }

        const CHECK_ERRORS : any = {
            [ERRORS_TYPES.NOT_FOUND]: ()=>{
                notify.error('Not Found');
                sendApiErrorLog(e);
            },
            [ERRORS_TYPES.NOT_PERMISSION]:    () => {
                notify.error('Your have not permissions.');
                sendApiErrorLog(e);
            },
            // [ERRORS_TYPES.NOT_AUTHORIZE]: () => {
            //     notify.error(DEFAULT_MESSAGE);
            //     sendApiErrorLog(e);
            // },
            [ERRORS_TYPES.SERVER_ERROR]: () => {
                notify.error(DEFAULT_MESSAGE);
                sendApiErrorLog(e);
            },
            // [ERRORS_TYPES.TOO_MANY_ATTEMPTS]: () => {
            //     notify.error(DEFAULT_MESSAGE);
            //     sendApiErrorLog(e);
            // },
            [ERRORS_TYPES.VALIDATION_ERROR]:  (e : any) => {
                errorsHandler()
            },
        };

        // for standard response
        if (CHECK_ERRORS[(ERRORS as any)[e?.code]]) {
            CHECK_ERRORS[(ERRORS as any)[e.code]](e)
        // for list errors without status
        } else if (Array.isArray(e?.errors)) {
            errorsHandler()
        } else {
            notify.error(DEFAULT_MESSAGE);
        }
    }

    return {requestError : requestError}
};