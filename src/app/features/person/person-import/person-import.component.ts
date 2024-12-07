import { Component, inject, OnInit } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

import person_data from './data';

@Component({
  selector: 'app-person-import',
  templateUrl: './person-import.component.html',
  standalone: true,
  imports: [],
})
export class PersonImportComponent implements OnInit {
  private _firestore = inject(Firestore);

  records = person_data;

  ngOnInit(): void {
    console.log('PersonImportComponent');

    let mapped = this.records.map((person) => {
      let temp = {
        rut: person['RUT'],
        name: person['NAME'],
        middle_name: person['MIDDLE_NAME'],
        first_name: person['FIRST_NAME'],
        last_name: person['LAST_NAME'],
        birthday: person['BIRTHDAY'],
        email: person['EMAIL'],
        phone: person['PHONE'],
        address: person['ADRESS'],
        gender: person['GENDER'],
        observations: person['OBSERVATIONS'],
      };

    //   addDoc(collection(this._firestore, 'person'), temp);
      return temp;
    });

    console.log(mapped);
  }
}
