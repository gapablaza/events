import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import APP_ROUTES from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    provideFirebaseApp(() => initializeApp({
        projectId: 'events-77388',
        appId: '1:316890990808:web:34a48f2df1ec3e2b016fad',
        storageBucket: 'events-77388.appspot.com',
        apiKey: 'AIzaSyDt6b4k_5zISR_t12vV5Zsrr60zyaji0yU',
        authDomain: 'events-77388.firebaseapp.com',
        messagingSenderId: '316890990808',
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};
