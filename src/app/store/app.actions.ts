import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AuthUser, Locality } from '../core/model';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    // general login
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: AuthUser }>(),
    'Login Failure': emptyProps(),

    'Check Auth': emptyProps(),
    'Auth Success': props<{ user: AuthUser | null }>(),
    'Auth Failure': emptyProps(),

    // logout
    'Logout Start': emptyProps(),
    'Logout Finish': emptyProps(),

    // load localities
    'Load Localities': emptyProps(),
    'Load Localities Success': props<{ localities: Locality[] }>(),
    'Load Localities Failure': emptyProps(),
  },
});
