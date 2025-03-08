import { Component, inject, OnInit } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

import locality_data from './locality.data';
import { Locality } from '../../../core/model';

@Component({
    selector: 'app-import-localities',
    template: '',
    imports: []
})
export class ImportLocalitiesComponent implements OnInit {
  private _firestore = inject(Firestore);
  private PATH = 'locality';

  records = locality_data;

  ngOnInit(): void {
    console.log('ImportLocalitiesComponent');

    let mapped = this.records.map((locality: Locality) => {
      this.saveLocality(locality);
    });

    console.log(mapped);
  }

  async saveLocality(locality: Locality) {
    const temp = {
      display_name: locality.display_name,
      name: locality.name,
      sector: locality.sector,
      region: locality.region,
      country: locality.country,
    };

    await setDoc(doc(this._firestore, this.PATH, locality.id), temp);
  }
}
