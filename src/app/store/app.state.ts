import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthUser, Locality } from '../core/model';
import { appActions } from './app.actions';

interface State {
  isInit: boolean;
  authUser: AuthUser | null;
  isAuth: boolean;

  localities: Locality[];

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  isInit: false,
  authUser: null,
  isAuth: false,

  localities: [],

  isProcessing: false,
  error: null,
};

export const appFeature = createFeature({
  name: 'app',
  reducer: createReducer(
    initialState,

    // login
    on(appActions.login, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(appActions.loginSuccess, (state, { user }) => ({
      ...state,
      authUser: user,
      isAuth: true,
      isProcessing: false,
    })),
    on(appActions.loginFailure, (state) => ({
      ...state,
      authUser: null,
      isAuth: false,
      isProcessing: false,
    })),

    on(appActions.checkAuth, (state) => ({
      ...state,
      isInit: false,
      isProcessing: true,
    })),
    on(appActions.authSuccess, (state, { user }) => ({
      ...state,
      isInit: true,
      authUser: user,
      isAuth: true,
      isProcessing: false,
    })),
    on(appActions.authFailure, (state) => ({
      ...state,
      isInit: true,
      authUser: null,
      isAuth: false,
      isProcessing: false,
    })),

    // logout
    on(appActions.logoutStart, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(appActions.logoutFinish, (state) => ({
      ...state,
      authUser: null,
      isAuth: false,
      isProcessing: false,
    })),

    // load localities
    on(appActions.loadLocalities, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(appActions.loadLocalitiesSuccess, (state, { localities }) => ({
      ...state,
      localities,
      isProcessing: false,
    })),
    on(appActions.loadLocalitiesFailure, (state) => ({
      ...state,
      localities: [],
      isProcessing: false,
    }))
  ),
});
