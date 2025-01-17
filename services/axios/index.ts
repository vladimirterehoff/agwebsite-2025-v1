// Libs
import axios from 'axios';
// Redux
import { store } from '@/app-redux/config';
import { authActions } from 'app-redux/auth/actions';
// Constants
import { clearClientToken, clearUserToken } from "../token";
import { ERRORS_TYPES, ERRORS } from '@/utils/errors';

let isRefreshing = false;
let subscribers: any = [];

/**
 * AXIOS base configuration
 */
const api = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});

/**
 * Request Inspector
 */
api.interceptors.request.use(
    function (config) {
        //Add Authorization token
        const token: any = store?.getState()?.auth?.token?.access_token;
        // Token for getting actual YourCart data
        if (typeof window != 'undefined' && token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

/**
 * Response Inspector
 */
api.interceptors.response.use(
    (response) => {
        // Do something with response data
        const data = response.data;
        return Promise.resolve(data);
    },
    (err) => {
        const {
            config,
            response
        } = err;
        const status = response?.status
        const originalRequest = config;
        const profile: any = store?.getState()?.profile?.profile;

        /**
         * If token is not valid, get new token and resend the request.
         * Check 401 status.
         */
        if (ERRORS[status] === ERRORS_TYPES.NOT_AUTHORIZE &&
            typeof window != 'undefined') {
            if (profile) {
                /*authActions.logout(store?.getState()?.auth?.scope);*/
                const scope = store?.getState()?.auth?.scope;
                clearClientToken(scope);
                clearUserToken(scope);
                window.location.reload();
            } else {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const scope: any = store?.getState()?.auth?.scope;
                    authActions.getAuthToken(scope).then((token) => {
                        isRefreshing = false;
                        onRefreshed(token.access_token);
                        subscribers = [];
                    });
                }
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest).then((response) => {
                            const data = response.data;
                            return Promise.resolve(data);
                        }).catch((err) => {
                            return Promise.reject(err.response?.data || err);
                        }));
                    });
                });
            }
        }
        return Promise.reject(err?.response?.data || err);
    }
);

const onRefreshed = ( authorisationToken : string) => {
    subscribers.map((cb: (token: string)=>void) => cb(authorisationToken));
}

const subscribeTokenRefresh = (cb: (token: string)=>void) => {
    subscribers.push(cb);
};

export default api;
