// Libs
import NextErrorComponent from 'next/error'
// Containers
import ErrorPage from "@/containers/ErrorPage"
// Helpers
import {sendLog} from "@/helpers/logs"
import { Log, LOG_LEVEL_TYPE } from '@/helpers/logs/model';
// Constants
import { COMPOSE_PROJECT_NAME } from '@/utils/envirenment'

const Error = ({ statusCode }:any) => {
    return (
        <ErrorPage statusCode={statusCode} />
    )
}

Error.getInitialProps = async({ res, err, asPath, req}:any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode || 500 : 404;

    const errorInitialProps = await NextErrorComponent.getInitialProps({
        res,
        err,
    } as any);

    let logs : Log = {
        message: `[${statusCode} error] ${statusCode == 404? 'Page not found' : ''}`,
        tags:[COMPOSE_PROJECT_NAME],
        trace:[],
        level: LOG_LEVEL_TYPE.WARNING,
        context:{
            "requestUri": asPath,
            "userAgent": req ? req.headers['user-agent'] : navigator.userAgent,
            "referer": req && req.headers['referer'] ? req.headers['referer'] : ''
        }
    }

    if(err){
        if(err.response){
            logs['level']=LOG_LEVEL_TYPE.API_ERROR;
            logs['message']=`[${err.response.status} error] ${err.toString()}`;
            logs['trace']=[
                `path: ${err.request?.path}`,
                `method: ${err.request?.method}`
            ]
        }
        else{
            logs['level']=LOG_LEVEL_TYPE.ERROR;
            logs['message']=`[${statusCode} error] ${err.toString()}`;
            const stack = err.stack;
            const stackArr = stack.split('\n');
            const stackArrFormat = stackArr.map((e:any)=>e.replace('    at ','')).slice(0, 4);
            logs['trace']=stackArrFormat;
        }
    }

    if(res) console.log(JSON.stringify(logs));
    else sendLog(logs);

    return  errorInitialProps;
}

export default Error