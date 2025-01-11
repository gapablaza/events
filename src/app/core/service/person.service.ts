import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  limit,
  or,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { Person } from '../model';

export type PersonCreate = Omit<Person, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private _firestore = inject(Firestore);

  // lista las personas registradas y escucha posibles cambios
  list(): Observable<Person[]> {
    const refPersons = collection(this._firestore, 'person');
    let persons = collectionData(refPersons, {
      idField: 'id',
    }) as Observable<Person[]>;

    return persons;
  }

  // retorna las personas registradas una única vez
  all(): Promise<Person[]> {
    const refPersons = collection(this._firestore, 'person');
    return getDocs(refPersons).then(snapshot => 
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Person))
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

  search(queryText: string): Observable<Person[]> {
    const normalizedQuery = queryText.trim().toLowerCase();
    const refPersons = collection(this._firestore, 'person');
    const q = query(
      refPersons,
      or(
        where('name', '>=', normalizedQuery),
        where('name', '<=', normalizedQuery + '\uf8ff'),
        where('first_name', '>=', normalizedQuery),
        where('first_name', '<=', normalizedQuery + '\uf8ff')
        // where('rut', '>=', normalizedQuery),
        // where('rut', '<=', normalizedQuery + '\uf8ff')
      ),
      limit(10)
    );
    const querySnapshot = getDocs(q);
    return from(querySnapshot).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id } as Person;
        })
      )
    );
  }

  // TO DO: Crear un índice para el campo rut en Firestore
  async add(person: PersonCreate): Promise<void> {
    const refPersons = collection(this._firestore, 'person');

    // Validar si el RUT está presente y es único
    if (person.rut) {
      const q = query(refPersons, where('rut', '==', person.rut));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('El RUT ya está registrado para otra persona.');
      }
    }

    // Agregar la persona si no hay conflicto de RUT
    await addDoc(refPersons, {
      ...person,
      registered_at: Timestamp.now(),
    });
  }

  async update(person: Person): Promise<void> {
    const refPersons = collection(this._firestore, 'person');

    // Validar si el RUT está presente y es único
    if (person.rut) {
      const q = query(refPersons, where('rut', '==', person.rut));
      const querySnapshot = await getDocs(q);

      // Validar si existe otro registro con el mismo RUT
      const hasDuplicateRut = querySnapshot.docs.some(
        (doc) => doc.id !== person.id // Ignorar el registro que estamos actualizando
      );

      if (hasDuplicateRut) {
        throw new Error('El RUT ya está registrado para otra persona.');
      }
    }

    // Actualizar la persona si no hay conflicto de RUT
    const refPerson = doc(this._firestore, `person/${person.id}`);
    await updateDoc(refPerson, {
      ...person,
      updated_at: Timestamp.now(),
    });
  }
}
