import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Activity, Locality, Person, Registration } from '../model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private _firestore = inject(Firestore);
  private RUCACURA_ID = 'rucacura-2025';

  activities(): Observable<Activity[]> {
    const activitiesRef = query(
      collection(this._firestore, `event/${this.RUCACURA_ID}/activities`)
    );

    let activities = collectionData(activitiesRef, {
      idField: 'id',
    }) as Observable<Activity[]>;

    return activities.pipe(
      map((activities) =>
        activities.sort((a, b) => (a.position || 0) - (b.position || 0))
      )
    );
    // return activities.pipe(
    //   map((activities) =>
    //     activities
    //       .map((activity) => {
    //         return { ...activity, id: activity.id } as Activity;
    //       })
    //       .sort((a, b) => (a.position || 0) - (b.position || 0))
    //   )
    // );
  }

  registrations(): Observable<Registration[]> {
    const registrationRef = query(
      collection(this._firestore, `event/${this.RUCACURA_ID}/registrations`)
    );

    let registrations = collectionData(registrationRef, {
      idField: 'id',
    }) as Observable<Registration[]>;

    return registrations;
  }

  // TO DO: Validar los Ids de las actividades
  async registerPerson(
    personId: string,
    localityId: string,
    activityIds: string[] = [],
    eventRegistrationData: {
      code?: string;
      totalCost?: number;
      requiresAccommodation?: boolean;
      licensePlate?: string;
      vehicleOwner?: boolean;
      observations?: string;
    }
  ): Promise<void> {
    // Batch to ensure atomicity
    const batch = writeBatch(this._firestore);

    // Reference for the person's registration in the event
    const eventRegistrationRef = doc(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations/${personId}`
    );

    // Add the registration to the batch
    batch.set(eventRegistrationRef, {
      person_id: personId,
      locality_id: localityId || null,
      code: eventRegistrationData.code || null,
      total_cost: eventRegistrationData.totalCost || null,
      activities_registered: activityIds,
      requires_accommodation: eventRegistrationData.requiresAccommodation,
      license_plate: eventRegistrationData.licensePlate || null,
      vehicle_owner: eventRegistrationData.vehicleOwner,
      observations: eventRegistrationData.observations || null,
      registered_at: Timestamp.now(),
    });

    // Add registrations for each activity if provided
    activityIds.forEach((activityId) => {
      const activityRegistrationRef = doc(
        this._firestore,
        `event/${this.RUCACURA_ID}/activities/${activityId}/registrations/${personId}`
      );

      batch.set(activityRegistrationRef, {
        person_id: personId,
        registered_at: Timestamp.now(),
        attendance_at: null, // Attendance will be updated later
        status: 'registered',
      });
    });

    // Commit the batch
    try {
      await batch.commit();
      console.log('Registration successfully completed');
    } catch (error) {
      console.error('Error registering person to event and activities:', error);
      throw error;
    }
  }

  // TO DO: Validar los Ids de las actividades
  async registrate(
    person: Person,
    locality: Locality,
    activitiesIds: string[] = [],
    registrationData: {
      code?: string;
      totalCost?: number;
      requiresAccommodation?: boolean;
      licensePlate?: string;
      vehicleOwner?: boolean;
      observations?: string;
    }
  ): Promise<void> {
    // Referencias principales
    const eventRegistrationRef = doc(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations/${person.id}`
    );

    const registrationsCollectionRef = collection(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations`
    );

    // Validar si la persona ya está registrada
    const existingPersonSnapshot = await getDoc(eventRegistrationRef);
    if (existingPersonSnapshot.exists()) {
      throw new Error('La persona ya está registrada en este evento.');
    }

    // Validar si el código ya está registrado
    if (registrationData.code) {
      const codeQuery = query(
        registrationsCollectionRef,
        where('code', '==', registrationData.code)
      );
      const codeQuerySnapshot = await getDocs(codeQuery);
      if (!codeQuerySnapshot.empty) {
        throw new Error('El código ya está registrado en este evento.');
      }
    }

    // Si pasan las validaciones se comienza con el batch
    // Batch to ensure atomicity
    const batch = writeBatch(this._firestore);

    // Add the registration to the batch
    batch.set(eventRegistrationRef, {
      person_id: person.id,
      person_info: person,
      locality_id: locality.id,
      locality_info: locality,
      code: registrationData.code || null,
      total_cost: registrationData.totalCost || null,
      activities_registered: activitiesIds,
      requires_accommodation: registrationData.requiresAccommodation || null,
      license_plate: registrationData.licensePlate || null,
      vehicle_owner: registrationData.vehicleOwner || null,
      observations: registrationData.observations || null,
      registered_at: Timestamp.now(),
    });

    // Add registrations for each activity if provided
    activitiesIds.forEach((activityId) => {
      const activityRegistrationRef = doc(
        this._firestore,
        `event/${this.RUCACURA_ID}/activities/${activityId}/registrations/${person.id}`
      );

      batch.set(activityRegistrationRef, {
        person_id: person.id,
        registered_at: Timestamp.now(),
        attendance_at: null, // Attendance will be updated later
        status: 'registered',
      });
    });

    // Commit the batch
    try {
      await batch.commit();
      console.log('Registration successfully completed');
    } catch (error) {
      console.error('Error registering person to event and activities:', error);
      throw error;
    }
  }
}
