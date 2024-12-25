import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, collectionSnapshots, doc, docData, Firestore, QueryDocumentSnapshot, updateDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Person } from '../model';

export type PersonCreate = Omit<Person, 'id'>;

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

  get(personId: string): Observable<Person> {
    const refPerson = doc(this._firestore, `person/${personId}`);
    let person = docData(refPerson) as Observable<any>;

    return person.pipe(
      map((person) => {
        return { ...person, id: personId } as Person;
      })
    );
  }

  add(person: PersonCreate) {
    const refPerson = collection(this._firestore, 'person');
    return addDoc(refPerson, {
      ...person,
    });
  }

  update(person: Person) {
    const refPerson = doc(this._firestore, `person/${person.id}`);
    return updateDoc(refPerson, {
      ...person,
    });
  }
}
