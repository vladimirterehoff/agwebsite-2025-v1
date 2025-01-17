// Libs
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import { createStore, applyMiddleware, AnyAction } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import { AppState } from './state';
import { reducers } from './reducers';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, AnyAction>;

export function createReducer<State, Payload>(initialState : State, reducerState : any) {
  type Action  = { type : string; payload? :Payload };
  return (state = initialState, action: Action): State => {
    const newState = reducerState[action.type];
    if (!newState) return state;
    return newState(state, action.payload);
  }
};

const rootReducer = (state: AppState, action: AnyAction) => {
  if (action.type === HYDRATE && state) {
    if (!Object.keys(action.payload).length) return state;
    else return action.payload;
  }

  return reducers(state, action);
};

export let store : any = createStore(rootReducer, (composeWithDevTools as any)(applyMiddleware(thunk)));
export let dispatch: any = (action : any, ssrStore? : any) => {
  ssrStore? ssrStore.dispatch(action) : store.dispatch(action);
};

export const makeStore = (context: any) => {
  if (context.req) {
    if(context.req.url.indexOf('_next/data')<0){
      const serverStore =  createStore(rootReducer, (composeWithDevTools as any)(applyMiddleware(thunk)));
      return serverStore;
    }
    else return createStore(()=>{return {}});
  }
  return store;
};

export const wrapper: any = createWrapper(makeStore, { debug: false });
