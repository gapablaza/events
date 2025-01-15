import { Component, inject, OnInit } from '@angular/core';
import { doc, Firestore, setDoc, Timestamp } from '@angular/fire/firestore';

import person_data from './person.data';

@Component({
  selector: 'app-import-persons',
  template: '',
  standalone: true,
  imports: [],
})
export class ImportPersonsComponent implements OnInit {
  private _firestore = inject(Firestore);
  private PATH = 'person';

  records = person_data;

  ngOnInit(): void {
    console.log('ImportPersonsComponent');

    let mapped = this.records.map((person: any) => {
      this.savePerson(person);
    });

    console.log(mapped);
  }

  async savePerson(person: any) {
    const temp = {
      rut: person.rut || null,
      name: person.name,
      middle_name: person.middle_name || null,
      first_name: person.first_name,
      last_name: person.last_name || null,
      birthday: person.birthday || null,
      email: person.email || null,
      phone: person.phone || null,
      address: person.address || null,
      gender: person.gender || null,
      profession: person.profession || null,
      license_plate: person.license_plate || null,
      medical_conditions: person.medical_conditions || null,
      locality_id: person.locality_id,
      locality_info: null,
      observations: person.observations || null,
      hidden_at: null,
      registered_at: Timestamp.now(),
      updated_at: null,
    };

    await setDoc(doc(this._firestore, this.PATH, person.id), temp);
  }
}
