import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { AuthUser } from './core/model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private firestore = inject(Firestore);
  authSrv = inject(AuthService);

  title = 'events';

  refDoc = doc(this.firestore, 'activity/VIaRKPPGshhtKOE5CcEa');
  testDoc = docData(this.refDoc);

  refCol = collection(this.firestore, 'activity');
  testCol = collectionData(this.refCol);

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user: AuthUser) => {
      if (user) {
        this.authSrv.currentUserSig.set({
          uid: user.uid,
          email: user.email
        });
      } else {
        this.authSrv.currentUserSig.set(null);
      }
      console.log(this.authSrv.currentUserSig());
    });
  }

  logout() {
    this.authSrv.logout();
  }
}
