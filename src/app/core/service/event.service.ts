import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  documentId,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';

import { Activity, Attendance, Locality, Person, Registration } from '../model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private _firestore = inject(Firestore);
  private RUCACURA_ID = 'rucacura-2025';

  // Retorna las actividades del evento
  // opcionalmente se puede incluir el conteo de inscripciones en cada actividad
  activities(includeCounts: boolean = false): Observable<Activity[]> {
    const activitiesRef = query(
      collection(this._firestore, `event/${this.RUCACURA_ID}/activities`)
    );

    let activities$ = collectionData(activitiesRef, {
      idField: 'id',
    }) as Observable<Activity[]>;

    return activities$.pipe(
      switchMap((activities) => {
        if (!includeCounts) {
          // Retornar actividades sin incluir los conteos
          return of(
            activities.sort((a, b) => (a.position || 0) - (b.position || 0))
          );
        }

        // Incluir los conteos de registros para cada actividad
        const activitiesWithCounts$ = activities.map((activity) =>
          from(this._getActivityRegistrationCount(activity.id)).pipe(
            map((count) => ({ ...activity, registrationCount: count }))
          )
        );

        // Combinar resultados de las actividades con sus conteos
        return combineLatest(activitiesWithCounts$).pipe(
          map((activitiesWithCounts) =>
            activitiesWithCounts.sort(
              (a, b) => (a.position || 0) - (b.position || 0)
            )
          )
        );
      })
    );
  }

  // Método auxiliar para obtener el conteo de registros de una actividad
  private async _getActivityRegistrationCount(
    activityId: string
  ): Promise<number> {
    const registrationsRef = collection(
      this._firestore,
      `event/${this.RUCACURA_ID}/activities/${activityId}/registrations`
    );

    const snapshot = await getCountFromServer(registrationsRef);
    return snapshot.data().count;
  }

  // retorna las inscripciones de una actividad específica
  getActivityRegistrations(activityId: string): Observable<Attendance[]> {
    const registrationsRef = query(
      collection(
        this._firestore,
        `event/${this.RUCACURA_ID}/activities/${activityId}/registrations`
      )
    );

    return collectionData(registrationsRef, {
      idField: 'id',
    }) as Observable<Attendance[]>;
  }

  // Retorna una inscripción en particular
  getRegistration(registrationId: string): Observable<Registration> {
    console.log('getRegistration');
    const refRegistration = doc(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations/${registrationId}`
    );
    let registration = docData(refRegistration) as Observable<any>;

    return registration.pipe(
      map((registration) => {
        console.log(registration);
        return {
          id: registrationId,
          ...registration,
        };
      })
    );
  }

  // Retorna todas las inscripciones de un evento
  registrations(): Observable<Registration[]> {
    const registrationRef = query(
      collection(this._firestore, `event/${this.RUCACURA_ID}/registrations`)
    );

    let registrations = collectionData(registrationRef, {
      idField: 'id',
    }) as Observable<Registration[]>;

    return registrations;
  }

  // Registra a una persona en el evento (nueva inscripción)
  // TO DO: Validar los Ids de las actividades
  async registrate(
    person: Person,
    locality: Locality,
    activitiesIds: string[] = [],
    registrationData: {
      totalCost?: number;
      totalPaid?: number;
      code?: string;
      insideEnclosure?: boolean;
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
      activities_registered: activitiesIds,
      total_cost:
        registrationData.totalCost !== undefined
          ? registrationData.totalCost
          : 0,
      total_paid:
        registrationData.totalPaid !== undefined
          ? registrationData.totalPaid
          : 0,
      code: registrationData.code || null,
      // inside_enclosure: registrationData.insideEnclosure || null,
      inside_enclosure:
        registrationData.insideEnclosure !== undefined
          ? registrationData.insideEnclosure
          : null,
      license_plate: registrationData.licensePlate || null,
      // vehicle_owner: registrationData.vehicleOwner || null,
      vehicle_owner:
        registrationData.vehicleOwner !== undefined
          ? registrationData.vehicleOwner
          : null,
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
        person_info: person,
        locality_id: locality.id,
        locality_info: locality,
        registered_at: Timestamp.now(),
        attendance_at: null, // Attendance will be updated later
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

  // Actualiza los datos de una inscripción
  // TO DO: Definir si se permitirá actualizar los datos de la persona
  async editRegistration(
    updatedPerson: Person,
    updatedLocality: Locality,
    updatedActivitiesIds: string[] = [],
    updatedRegistrationData: {
      totalCost?: number;
      totalPaid?: number;
      code?: string;
      insideEnclosure?: boolean;
      licensePlate?: string;
      vehicleOwner?: boolean;
      observations?: string;
    }
  ): Promise<void> {
    console.log(updatedRegistrationData);
    // Referencias principales
    const eventRegistrationRef = doc(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations/${updatedPerson.id}`
    );

    const registrationsCollectionRef = collection(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations`
    );

    // Verificar si la inscripción existe
    const existingRegistrationSnapshot = await getDoc(eventRegistrationRef);
    if (!existingRegistrationSnapshot.exists()) {
      throw new Error('La inscripción no existe para esta persona.');
    }

    // Validar si el código ya está registrado para otra persona
    if (updatedRegistrationData.code) {
      const codeQuery = query(
        registrationsCollectionRef,
        where('code', '==', updatedRegistrationData.code),
        where(documentId(), '!=', updatedPerson.id) // Excluir la inscripción actual
      );
      const codeQuerySnapshot = await getDocs(codeQuery);
      if (!codeQuerySnapshot.empty) {
        throw new Error('El código ya está registrado para otra inscripción.');
      }
    }

    // Preparar batch para la edición
    const batch = writeBatch(this._firestore);

    // Actualizar la inscripción principal
    batch.update(eventRegistrationRef, {
      locality_id: updatedLocality.id,
      locality_info: updatedLocality,
      activities_registered: updatedActivitiesIds,
      total_cost:
        updatedRegistrationData.totalCost !== undefined
          ? updatedRegistrationData.totalCost
          : 0,
      total_paid:
        updatedRegistrationData.totalPaid !== undefined
          ? updatedRegistrationData.totalPaid
          : 0,
      code: updatedRegistrationData.code || null,
      inside_enclosure:
        updatedRegistrationData.insideEnclosure !== undefined
          ? updatedRegistrationData.insideEnclosure
          : null,
      license_plate: updatedRegistrationData.licensePlate || null,
      vehicle_owner:
        updatedRegistrationData.vehicleOwner !== undefined
          ? updatedRegistrationData.vehicleOwner
          : null,
      observations: updatedRegistrationData.observations || null,
      updated_at: Timestamp.now(),
    });

    // Obtener los datos actuales de la inscripción
    const currentRegistration =
      existingRegistrationSnapshot.data() as Registration;

    // Eliminar referencias a actividades no seleccionadas en la edición
    const removedActivities = (
      currentRegistration.activities_registered || []
    ).filter(
      (activityId: string) => !updatedActivitiesIds.includes(activityId)
    );

    removedActivities.forEach((activityId) => {
      console.log('remover actividad: ', activityId);
      const activityRegistrationRef = doc(
        this._firestore,
        `event/${this.RUCACURA_ID}/activities/${activityId}/registrations/${updatedPerson.id}`
      );
      batch.delete(activityRegistrationRef);
    });

    // Agregar referencias para las nuevas actividades seleccionadas
    updatedActivitiesIds.forEach((activityId) => {
      const activityRegistrationRef = doc(
        this._firestore,
        `event/${this.RUCACURA_ID}/activities/${activityId}/registrations/${updatedPerson.id}`
      );

      if (
        !(currentRegistration.activities_registered || []).includes(activityId)
      ) {
        console.log('agregar actividad: ', activityId);
        batch.set(activityRegistrationRef, {
          person_id: updatedPerson.id,
          person_info: updatedPerson,
          locality_id: updatedLocality.id,
          locality_info: updatedLocality,
          registered_at: Timestamp.now(),
          attendance_at: null,
        });
      }
    });

    // Commit del batch
    try {
      await batch.commit();
      console.log('Registration successfully updated');
    } catch (error) {
      console.error('Error updating registration:', error);
      throw error;
    }
  }

  // Elimina una inscripción y sus actividades asociadas
  // TO DO: Por definir si se podrá eliminar una inscripción que tiene asistencia registrada
  async deleteRegistration(personId: string): Promise<void> {
    // Referencia a la inscripción principal
    const eventRegistrationRef = doc(
      this._firestore,
      `event/${this.RUCACURA_ID}/registrations/${personId}`
    );

    // Obtener los datos actuales de la inscripción
    const existingRegistrationSnapshot = await getDoc(eventRegistrationRef);
    if (!existingRegistrationSnapshot.exists()) {
      throw new Error('La inscripción no existe.');
    }

    const currentRegistration =
      existingRegistrationSnapshot.data() as Registration;

    // Batch para eliminar la inscripción principal y las actividades asociadas
    const batch = writeBatch(this._firestore);

    // Eliminar la inscripción principal
    batch.delete(eventRegistrationRef);

    // Eliminar referencias de las actividades registradas
    (currentRegistration.activities_registered || []).forEach(
      (activityId: string) => {
        const activityRegistrationRef = doc(
          this._firestore,
          `event/${this.RUCACURA_ID}/activities/${activityId}/registrations/${personId}`
        );
        batch.delete(activityRegistrationRef);
      }
    );

    // Commit del batch
    try {
      await batch.commit();
      console.log('Inscripción eliminada exitosamente');
    } catch (error) {
      console.error('Error al intentar eliminar la inscripción:', error);
      throw error;
    }
  }

  // Obtiene el conteo de inscripciones de un evento
  async registrationsCount(): Promise<number> {
    try {
      // Referencia a la colección de registros del evento
      const registrationsCollectionRef = collection(
        this._firestore,
        `event/${this.RUCACURA_ID}/registrations`
      );

      // Consulta el conteo de documentos
      const snapshot = await getCountFromServer(registrationsCollectionRef);
      return snapshot.data().count; // Retorna el número de documentos
    } catch (error) {
      console.error('Error al obtener el conteo de registros:', error);
      throw new Error('No se pudo obtener el conteo de registros del evento.');
    }
  }
}
