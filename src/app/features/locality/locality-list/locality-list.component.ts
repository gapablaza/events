import { Component, OnInit } from '@angular/core';

import { LocalityService } from '../../../core/service';
import { Locality } from '../../../core/model';

@Component({
  selector: 'app-locality-list',
  templateUrl: './locality-list.component.html',
  standalone: true,
  imports: [],
})
export class LocalityListComponent implements OnInit {
  localities: Locality[] = [];

  constructor(private _localitySrv: LocalityService) {}

  ngOnInit(): void {
    console.log('LocalityListComponent');

    this._localitySrv.list().subscribe((localities) => {
      this.localities = localities;
      console.log(localities);
    });
  }
}
