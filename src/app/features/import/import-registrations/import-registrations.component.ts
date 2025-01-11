import { Component, inject } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import { Person } from '../../../core/model';
import { appFeature } from '../../../store/app.state';
import { EventService } from '../../../core/service';

export type PersonCreate = Omit<Person, 'id'>;

@Component({
  selector: 'app-import-person',
  templateUrl: './import-registrations.component.html',
  standalone: true,
  imports: []
})
export class ImportRegistrationsComponent {
  firestore = inject(Firestore);
  store = inject(Store);
  eventSrv = inject(EventService);

  PERSON_PATH = 'person';
  EVENT_PATH = 'event';

  localities = this.store.selectSignal(appFeature.selectLocalities);
  fileContent: any[] | null = null;
  importStatus: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (Array.isArray(data)) {
            // this.fileContent = data as Person[];
            this.fileContent = data;
            this.importStatus = 'Archivo cargado con éxito.';
          } else {
            this.importStatus = 'El archivo JSON no contiene un array de datos.';
          }
        } catch (error) {
          console.log(error);
          this.importStatus = 'Error al leer el archivo JSON.';
        }
      };
      reader.readAsText(file);
    }
  }

  async importData(): Promise<void> {
    console.log(this.fileContent);
    if (!this.fileContent) return;

    this.importStatus = 'Importando datos...';

    try {
      for (const record of this.fileContent) {
        await this.addPersonAndRegisterInEvent(record);
      }
      this.importStatus = 'Datos importados con éxito.';
    } catch (error) {
      console.error(error);
      this.importStatus = 'Error al importar datos';
    }
  }

  private async addPersonAndRegisterInEvent(record: any) {
    try {
      // Agregar persona a la colección "person"
      const personRef = collection(this.firestore, this.PERSON_PATH);
      const locality = this.localities().find((locality) => locality.id === record.locality_id) || null;
      const personData = {
        rut: record.rut || null,
        name: record.name || null,
        middle_name: record.middle_name || null,
        first_name: record.first_name || null,
        last_name: record.last_name || null,        
        birthday: record.birthday || null,
        email: record.email || null,
        phone: record.phone ? '' + record.phone : null,
        address: record.address || null,
        gender: record.gender || null,
        profession: record.profession || null,
        license_plate: record.license_plate_p || null,
        medical_conditions: record.medical_conditions || null,
        locality_id: record.locality_id || null,
        locality_info: locality,
        observations: 'CARGA MASIVA Inscripción Rucacura 2025',
        hidden_at: null,
        registered_at: Timestamp.now(),
        updated_at: null,
      } as unknown as PersonCreate;
      
      const personDoc = await addDoc(personRef, personData);

      // Agregar persona al evento "rucacura-2025" en la colección "event"
      const registrationData = {
        totalCost: record.total_cost ? record.total_cost * 1 : 0,
        totalPaid: record.total_paid ? record.total_paid * 1 : 0,
        code: record.code || null,
        insideEnclosure: record.inside_enclosure == 1 ? true : (record.inside_enclosure == 0 ? false : undefined),
        licensePlate: record.license_plate_r || null,
        vehicleOwner: record.vehicle_owner == 1 ? true : (record.vehicle_owner == 0 ? false : undefined),
        observations: record.observations || null,
      };
      let activities: string[] = [];
      if (record.lu && Number(record.lu) === 1) activities.push('lunes');
      if (record.ma && Number(record.ma) === 1) activities.push('martes');
      if (record.mi && Number(record.mi) === 1) activities.push('miercoles');
      if (record.ju && Number(record.ju) === 1) activities.push('jueves');
      if (record.vi && Number(record.vi) === 1) activities.push('viernes');
      if (record.sa && Number(record.sa) === 1) activities.push('sabado');
      if (record.do && Number(record.do) === 1) activities.push('domingo');

      // console.log(
      //   { ...personData, id: personDoc.id },
      //   locality!,
      //   activities,
      //   registrationData
      // );

      await this.eventSrv.registrate(
        { ...personData, id: personDoc.id },
        locality!,
        activities,
        registrationData
      );

      console.log(`Persona registrada en el evento "rucacura-2025" con ID: ${personDoc.id}`);
    } catch (error) {
      console.error('Error al registrar persona y evento:', error);
      throw error; // Propagar el error para manejarlo en el método principal
    }
  }
}
