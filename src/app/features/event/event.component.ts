import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventActions } from './store/event.actions';

@Component({
  selector: 'app-event',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet],
})
export class EventComponent implements OnInit, OnDestroy {
  store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(eventActions.moduleOpened());
  }

  ngOnDestroy(): void {
    this.store.dispatch(eventActions.moduleClosed());
  }
}
