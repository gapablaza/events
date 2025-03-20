import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { version } from '../../package.json';
import { appFeature } from './store/app.state';
import { appActions } from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, RouterLink],
})
export class AppComponent implements OnInit {
  store = inject(Store);

  isInit = this.store.selectSignal(appFeature.selectIsInit);
  isAuth = this.store.selectSignal(appFeature.selectIsAuth);
  v = version;
  menuOpen = false; // Estado del menú móvil

  ngOnInit(): void {
    this.store.dispatch(appActions.checkAuth());
  }

  // Método para alternar el estado del menú
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.store.dispatch(appActions.logoutStart());
  }
}
