import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';

import { AuthUser } from '../core/model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);

  register(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then(() => {});

    return from(promise);
  }

  login(email: string, password: string): Observable<AuthUser> {
    const promise = signInWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    ).then((credentials) => {
      const appUser: AuthUser = {
        uid: credentials.user.uid,
        displayName: credentials.user.displayName!,
        email: credentials.user.email!,
        photoURL: credentials.user.photoURL ?? undefined,
      };
      return appUser;
    });

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth).catch((error) => console.log(error));

    return from(promise);
  }

  // Escucha los cambios de estado de autenticación
  onAuthStateChanged(): Observable<User | null> {
    return new Observable((subscriber) => {
      onAuthStateChanged(
        this.auth,
        (user) => {
          subscriber.next(user);
          subscriber.complete();
        },
        (error) => {
          subscriber.error(error);
        }
      );
    });
  }

  authState(): Observable<AuthUser | null> {
    return authState(this.auth).pipe(
      map((firebaseUser) => {
        if (!firebaseUser) {
          return null;
        } else {
          const appUser: AuthUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName!,
            email: firebaseUser.email!,
            photoURL: firebaseUser.photoURL ?? undefined,
          };
          return appUser;
        }
      })
    );
  }
}
