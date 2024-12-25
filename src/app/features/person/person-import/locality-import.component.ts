import { Component, inject, OnInit } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

import locality_data from './locality';

interface Locality {
    display_name: string;
    name: string;
    sector: string;
    region: string;
    country: string;
  }

@Component({
    selector: 'app-locality-import',
    template: '',
    imports: []
})
export class LocalityImportComponent implements OnInit {
  private _firestore = inject(Firestore);

  records = locality_data;

  ngOnInit(): void {
    console.log('LocalityImportComponent');

    let mapped = this.records.map((locality: Locality) => {
      let temp = {
        display_name: locality.display_name,
        name: locality.name,
        sector: locality.sector,
        region: locality.region,
        country: locality.country,
      };

    //   addDoc(collection(this._firestore, 'locality'), temp);
      return temp;
    });

    console.log(mapped);
  }
}
