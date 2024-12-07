import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Person } from '../model';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private _firestore = inject(Firestore);

  list(): Observable<Person[]> {
    const refPersons = collection(this._firestore, 'person');
    let persons = collectionData(refPersons, {
      idField: 'id',
    }) as Observable<any[]>;

    return persons.pipe(
      map((person) =>
        person.map((p) => {
          return { ...p, id: p.id } as Person;
        })
      )
    );
  }
}
