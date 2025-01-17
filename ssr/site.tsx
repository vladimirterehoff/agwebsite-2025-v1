// Libs
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// Redux
import { wrapper, dispatch } from '@/app-redux/config';
import { AppState} from '@/app-redux/state';
import { authActions } from '@/app-redux/auth/actions';
import { profileActions } from '@/app-redux/profile/actions';
import { langActions } from "@/app-redux/lang/actions";
import { ACTION_TYPES } from "@/app-redux/auth/actionTypes";
// Constants
import { SITE_PATH } from '@/utils/routers/site';
import { SCOPE } from '@/utils/config/base';
import { ERRORS_TYPES, ERRORS } from '@/utils/errors';
import { TOKEN_PREFIX } from '@/utils/config/site';
import { LOCALES, I18nPages } from '@/utils/i18n';
import { ADMIN_MAIN } from '@/utils/routers/admin';

/**
 * Site SSR rendering function
 * @param type - type of the page ('private' | 'public' | 'authorization')
 * @param getData - get data of the page that must be indexing
 * @constructor
 */
export function SiteServerSideProps(
  type: 'private' | 'public' | 'authorization' = 'public',
  getData? : (ssrStore: AppState, query? : any) => void
) {
  return wrapper.getServerSideProps( (store: any) => async (context: any) => {
    return { redirect: {destination: ADMIN_MAIN } };

    const translations = await serverSideTranslations(context.locale, Object.values(I18nPages));
    const req : any = context.req;
    const res : any = context.res;
    const query: any = context.query;
    const cookies = req.cookies;
    const ssrStore: any = store;

    if(!Object.keys(ssrStore.getState()).length) return { props: { ...(translations) } };

    let accessToken = cookies[`${TOKEN_PREFIX}_clientToken`];
    let ResCookie : string[] = [];

    /**
     * Check Locale
     */
    const lang: any = LOCALES.find((item: any) => item.code === context.locale);
    lang && ResCookie.push(`NEXT_LOCALE=${lang.code};  path=/;`) &&  langActions.onChangeLang(lang, ssrStore);

    /**
     *  Check user token and get profile
     */
    const userToken = cookies[`${TOKEN_PREFIX}_userToken`];
    if(userToken){
      try{
        await profileActions.getProfile('', SCOPE.SITE, ssrStore, userToken);
        accessToken = userToken;
        ResCookie.push(`${TOKEN_PREFIX}_clientToken=deleted;  path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        if(type=='authorization') return { redirect: {destination: '/' } };
      }
      catch(e : any) {
        if(type=='private')  return { redirect: {destination: SITE_PATH.SIGN_IN } };
      }
    }
    else if(type=='private')  return { redirect: {destination: SITE_PATH.SIGN_IN } };

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
    const getClientToken = async () => {
      try{
        const token = await authActions.getAuthToken(SCOPE.SITE, ssrStore);
        const date = new Date(new Date().getTime()+Number(token.expires_in)*86400000).toUTCString();
        ResCookie.push(`${TOKEN_PREFIX}_userToken=deleted;  path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        ResCookie.push(`${TOKEN_PREFIX}_clientToken=${token.access_token}; path=/; expires=${date}`);
        accessToken = token.access_token;
      }catch (e:any){
        console.log('CREATE CLIENT TOKEN FAILD', e);
        if(e.response?.status == ERRORS_TYPES.NOT_FOUND) return { notFound: true };
        else throw e;
      }
    }
    if(!accessToken){
      const getClientTokenResult = await getClientToken();
      if(getClientTokenResult) return getClientTokenResult;
    }

    /**
     * Get SSR Data of the page
     */
    const getBaseData : any = async() => {
      try{
        //Add requests for getting global data (for example menu)

        if(getData) await getData(ssrStore, query);
        return {};
      }
      catch(e : any) {
        if((ERRORS as any)[e.code] == ERRORS_TYPES.NOT_AUTHORIZE){
          accessToken = null;
          await getClientToken();
          return await getBaseData();
        }
        else if((ERRORS as any)[e.code] == ERRORS_TYPES.NOT_FOUND) return { notFound: true };
        else throw e;
      }
    }
    const getDataResult = await getBaseData();

    /**
     * Set headers: cookie and cache
     */
    res.setHeader('set-cookie', ResCookie);
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    );

    return getDataResult? getDataResult : { props: { ...(translations) } };
  });
}



