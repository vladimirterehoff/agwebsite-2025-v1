// Redux
import { dispatch, wrapper } from '@/app-redux/config';
import { authActions } from '@/app-redux/auth/actions';
import { profileActions } from "@/app-redux/profile/actions";
import { ACTION_TYPES } from "@/app-redux/auth/actionTypes";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { SCOPE } from '@/utils/config/base';
import { TOKEN_PREFIX } from "@/utils/config/admin";
import { ERRORS_TYPES } from '@/utils/errors';

/**
 * Admin SSR rendering function
 * @param type
 * @constructor
 */
export function AdminServerSideProps(
  type: 'private' | 'public' | 'authorization' = 'public'
) {return wrapper.getServerSideProps( (store: any) => async (context: any) => {
    const req : any = context.req;
    const res : any = context.res;
    const query: any = context.query;
    const cookies = req.cookies;
    const ssrStore: any = store;

    if(!Object.keys(ssrStore.getState()).length) return;

    let accessToken = cookies[`${TOKEN_PREFIX}_clientToken`];
    let ResCookie : string[] = [];

    /**
    *  Check user token and get profile
    */
    const userToken = cookies[`${TOKEN_PREFIX}_userToken`];
    if(userToken){
        try{
            await profileActions.getProfile(undefined, SCOPE.ADMIN, ssrStore, userToken);
            accessToken = userToken;
            ResCookie.push(`${TOKEN_PREFIX}_clientToken=deleted;  path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
            if(type=='authorization') return { redirect: {destination: ADMIN_MAIN } };
        }
        catch(e : any) {
            if(type=='private')  return { redirect: {destination: ADMIN_PATH.LOGIN } };
        }
    }
    else if(type=='private')  return { redirect: {destination: ADMIN_PATH.LOGIN } };

    /**
     * Set authorization token to the state
     */
    if(accessToken)
        dispatch({ type: ACTION_TYPES.GET_OAUTH_TOKEN_SUCCESS, payload: {
            token:{
                access_token: accessToken,
                expires_in: 1
            },
            scope: SCOPE.ADMIN
        }}, ssrStore);

    /**
     * Get Client Token if user token and client token is undefined in cookie
     */
    if(!accessToken){
        try{
            const token = await authActions.getAuthToken(SCOPE.ADMIN, ssrStore);
            const date = new Date(new Date().getTime()+Number(token.expires_in)*86400000).toUTCString();
            ResCookie.push(`${TOKEN_PREFIX}_userToken=deleted;  path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
            ResCookie.push(`${TOKEN_PREFIX}_clientToken=${token.access_token}; path=/; expires=${date}`);
            accessToken = token.access_token;
        }
        catch (e:any){
            console.log('CREATE CLIENT TOKEN FAILED', e);
            if(e.response?.status == ERRORS_TYPES.NOT_FOUND) return { notFound: true };
            else throw e;
        }
    }

    /**
     * Set headers: cookie and cache
     */
    res.setHeader('set-cookie', ResCookie);
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    );

    return;
  })
}
