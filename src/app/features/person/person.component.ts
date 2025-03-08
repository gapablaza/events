import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { personFeature } from './store/person.state';
import { personActions } from './store/person.actions';

@Component({
    selector: 'app-person',
    template: `<router-outlet></router-outlet>`,
    imports: [RouterOutlet]
})
export class PersonComponent implements OnInit, OnDestroy {
  store = inject(Store);

  isInit = this.store.selectSignal(personFeature.selectIsInit);
  persons = this.store.selectSignal(personFeature.selectPersons);

  ngOnInit(): void {
    this.store.dispatch(personActions.moduleOpened());
  }

  ngOnDestroy(): void {
    this.store.dispatch(personActions.moduleClosed());
  }
}
