import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';

import { ActivityService } from '../../../core/service';
import { Activity, Attendance } from '../../../core/model';
import { AttendanceListComponent } from '../../attendance/attendance-list/attendance-list.component';
import {
  addDoc,
  collection,
  Firestore,
  Timestamp,
} from '@angular/fire/firestore';
import { AttendanceByCodeComponent } from '../../attendance/attendance-by-code/attendance-by-code.component';

@Component({
    selector: 'app-activity-profile',
    templateUrl: './activity-profile.component.html',
    imports: [AttendanceListComponent, AttendanceByCodeComponent]
})
export class ActivityProfileComponent implements OnInit {
  private firestore = inject(Firestore);

  activity: Activity | undefined;
  attendance: Attendance[] = [];

  records = [
    {
      N: '1',
      NOMBRES: 'Francisca María',
      APELLIDOS: 'Higuera Álvarez',
    },
    {
      N: '2',
      NOMBRES: 'Fernanda Andrea',
      APELLIDOS: 'Higuera Álvarez',
    },
    {
      N: '3',
      NOMBRES: 'Daniel Andrés',
      APELLIDOS: 'Nahuelpán González',
    },
    {
      N: '4',
      NOMBRES: 'Antonella Ignacia',
      APELLIDOS: 'Balladares Silva',
    },
    {
      N: '5',
      NOMBRES: 'Ayelén Rayen',
      APELLIDOS: 'Albino Muñoz',
    },
    {
      N: '6',
      NOMBRES: 'Fernanda Eunice',
      APELLIDOS: 'Muñoz Seguel',
    },
    {
      N: '7',
      NOMBRES: 'Camila Noemi ',
      APELLIDOS: 'Muñoz Seguel',
    },
    {
      N: '8',
      NOMBRES: 'Felipe Agustín',
      APELLIDOS: 'Farias Canales ',
    },
    {
      N: '9',
      NOMBRES: 'Pablo ',
      APELLIDOS: 'Salinas Roa',
    },
    {
      N: '10',
      NOMBRES: 'Sebastián Benjamín',
      APELLIDOS: 'Salinas Roa',
    },
    {
      N: '11',
      NOMBRES: 'Angel Andrés Israel ',
      APELLIDOS: 'Gajardo Espinoza ',
    },
    {
      N: '12',
      NOMBRES: 'Jose Pablo',
      APELLIDOS: 'Contreras Jara ',
    },
    {
      N: '13',
      NOMBRES: 'Josefa Antonia',
      APELLIDOS: 'Contreras Jara ',
    },
    {
      N: '14',
      NOMBRES: 'Cristobal Sebastián ',
      APELLIDOS: 'Cifuentes Cruces ',
    },
    {
      N: '15',
      NOMBRES: 'Isabel Magdalena ',
      APELLIDOS: 'Cifuentes Cruces ',
    },
    {
      N: '16',
      NOMBRES: 'Vicente Alberto',
      APELLIDOS: 'Flores Arias',
    },
    {
      N: '17',
      NOMBRES: 'Valentina Esperanza',
      APELLIDOS: 'Astete Cifuentes',
    },
    {
      N: '18',
      NOMBRES: 'Renata Esperanza',
      APELLIDOS: 'Astete Cifuentes',
    },
    {
      N: '19',
      NOMBRES: 'Esteban Andres ',
      APELLIDOS: 'Astete Cifuentes',
    },
    {
      N: '20',
      NOMBRES: 'Yajaira Paola',
      APELLIDOS: 'Vázquez Cheuquenao ',
    },
    {
      N: '21',
      NOMBRES: 'Dámaris Celena',
      APELLIDOS: 'Araneda Inostroza ',
    },
    {
      N: '22',
      NOMBRES: 'Antonia  Monserrat',
      APELLIDOS: 'Hanson Comas',
    },
    {
      N: '23',
      NOMBRES: 'Matias Ignacio',
      APELLIDOS: 'Hernandes  Vergara',
    },
    {
      N: '24',
      NOMBRES: 'Constanza Denis',
      APELLIDOS: 'Muñoz Mancilla',
    },
    {
      N: '25',
      NOMBRES: 'Mailen Andrea ',
      APELLIDOS: 'Muñoz Marchant',
    },
    {
      N: '26',
      NOMBRES: 'Laura  Madavy',
      APELLIDOS: 'Muñoz Marchant',
    },
    {
      N: '27',
      NOMBRES: 'Sarai Denis',
      APELLIDOS: 'San Martín Dumihuala ',
    },
    {
      N: '28',
      NOMBRES: 'Nehemias  Isaac',
      APELLIDOS: 'San Martín Dumihuala ',
    },
    {
      N: '29',
      NOMBRES: 'Daniel Jared ',
      APELLIDOS: 'San Martín Lastra',
    },
    {
      N: '30',
      NOMBRES: 'Simón Hernán',
      APELLIDOS: 'San Martín Lastra',
    },
    {
      N: '31',
      NOMBRES: 'Lucianno Renato',
      APELLIDOS: 'Valdebenito San Martin',
    },
    {
      N: '32',
      NOMBRES: 'Camila Natalia',
      APELLIDOS: 'Millalen Contreras',
    },
    {
      N: '33',
      NOMBRES: 'Cesar Ariel',
      APELLIDOS: 'Millalen Contreras',
    },
    {
      N: '34',
      NOMBRES: 'Claudia Paz',
      APELLIDOS: 'Millalen Contreras',
    },
    {
      N: '35',
      NOMBRES: 'Benjamín ',
      APELLIDOS: 'Carrión Cartes',
    },
    {
      N: '36',
      NOMBRES: 'Isabel Sofía ',
      APELLIDOS: 'Fernández Silva',
    },
    {
      N: '37',
      NOMBRES: 'Javier',
      APELLIDOS: 'Quelempan Lepin',
    },
    {
      N: '38',
      NOMBRES: 'Fernanda ',
      APELLIDOS: 'Quelempan Lepin',
    },
    {
      N: '39',
      NOMBRES: 'Fabián',
      APELLIDOS: 'Antinao Valle',
    },
    {
      N: '40',
      NOMBRES: 'Carol ',
      APELLIDOS: 'Huaiquinao Curiqueo',
    },
    {
      N: '41',
      NOMBRES: 'Karen',
      APELLIDOS: 'Huaiquinao Curiqueo',
    },
    {
      N: '42',
      NOMBRES: 'Daniel ',
      APELLIDOS: 'Quelempan Antinao',
    },
    {
      N: '43',
      NOMBRES: 'Yarlen',
      APELLIDOS: 'Ñancuche Figueroa',
    },
    {
      N: '44',
      NOMBRES: 'Matías',
      APELLIDOS: 'Curiqueo Carrasco',
    },
    {
      N: '45',
      NOMBRES: 'Matías',
      APELLIDOS: 'Quelempan Morales',
    },
    {
      N: '46',
      NOMBRES: 'Javiera',
      APELLIDOS: 'Quelempan Morales',
    },
    {
      N: '47',
      NOMBRES: 'Máximo ',
      APELLIDOS: 'Espinoza Quelempan',
    },
    {
      N: '48',
      NOMBRES: 'Benjamin Vicente',
      APELLIDOS: 'Acuña Fuentes',
    },
    {
      N: '49',
      NOMBRES: 'Julián Esteban',
      APELLIDOS: 'Aguilar Hueche',
    },
    {
      N: '50',
      NOMBRES: 'Consuelo Belén',
      APELLIDOS: 'Apablaza Bustamante',
    },
    {
      N: '51',
      NOMBRES: 'Mateo Andrés',
      APELLIDOS: 'Apablaza Bustamante',
    },
    {
      N: '52',
      NOMBRES: 'Valentina Daniela',
      APELLIDOS: 'Araya Garrido',
    },
    {
      N: '53',
      NOMBRES: 'Juan David',
      APELLIDOS: 'Barrientos Vega',
    },
    {
      N: '54',
      NOMBRES: 'Angela Noemi',
      APELLIDOS: 'Barrientos Vega',
    },
    {
      N: '55',
      NOMBRES: 'Pablo',
      APELLIDOS: 'Bustamante H',
    },
    {
      N: '56',
      NOMBRES: 'Isabela',
      APELLIDOS: 'Bustamante H',
    },
    {
      N: '57',
      NOMBRES: 'Matías Josué',
      APELLIDOS: 'Bustamante Huehuentro',
    },
    {
      N: '58',
      NOMBRES: 'Ayelen paloma',
      APELLIDOS: 'Bustos Poblete',
    },
    {
      N: '59',
      NOMBRES: 'Martin Isai',
      APELLIDOS: 'Cabrera Oliva',
    },
    {
      N: '60',
      NOMBRES: 'Mariana Diannymar',
      APELLIDOS: 'Castejón Prieto',
    },
    {
      N: '61',
      NOMBRES: 'Laura Victoria',
      APELLIDOS: 'Castejón Prieto',
    },
    {
      N: '62',
      NOMBRES: 'Lucia Paz',
      APELLIDOS: 'Castro Zuñiga',
    },
    {
      N: '63',
      NOMBRES: 'Josué Daniel',
      APELLIDOS: 'Ceballos Albornoz',
    },
    {
      N: '64',
      NOMBRES: 'Cristian Felipe Andrés',
      APELLIDOS: 'Ceballos albornoz',
    },
    {
      N: '65',
      NOMBRES: 'Debora Abigail',
      APELLIDOS: 'Durán Yáñez',
    },
    {
      N: '66',
      NOMBRES: 'Constanza Andrea',
      APELLIDOS: 'Durán Yáñez',
    },
    {
      N: '67',
      NOMBRES: 'Cristobal Alejandro',
      APELLIDOS: 'Gallardo Quiroz',
    },
    {
      N: '68',
      NOMBRES: 'Angelo Esteban',
      APELLIDOS: 'Garrido Grandon',
    },
    {
      N: '69',
      NOMBRES: 'Jorge Hanz',
      APELLIDOS: 'Gómez Redel',
    },
    {
      N: '70',
      NOMBRES: 'Maria Jose',
      APELLIDOS: 'Gonzalez Parada',
    },
    {
      N: '71',
      NOMBRES: 'Sofía Antonia',
      APELLIDOS: 'Hausheer Saavedra',
    },
    {
      N: '72',
      NOMBRES: 'Martina Antonia',
      APELLIDOS: 'Hermosilla Silva',
    },
    {
      N: '73',
      NOMBRES: 'Emilia Victoria',
      APELLIDOS: 'Hermosilla Ulloa',
    },
    {
      N: '74',
      NOMBRES: 'Pascal Alejandra',
      APELLIDOS: 'Hernández Carrasco',
    },
    {
      N: '75',
      NOMBRES: 'Florencia Andrea',
      APELLIDOS: 'Lagos Rodríguez',
    },
    {
      N: '76',
      NOMBRES: 'Joaquín Alexis',
      APELLIDOS: 'López Martínez',
    },
    {
      N: '77',
      NOMBRES: 'Gabriel Esteban',
      APELLIDOS: 'Manríquez Colihueque',
    },
    {
      N: '78',
      NOMBRES: 'Josefina Antonia',
      APELLIDOS: 'Montoya San Juan',
    },
    {
      N: '79',
      NOMBRES: 'Gabriel Leonardo',
      APELLIDOS: 'Montoya San Juan',
    },
    {
      N: '80',
      NOMBRES: 'Sofía',
      APELLIDOS: 'Nicholson',
    },
    {
      N: '81',
      NOMBRES: 'Catalina Elizabeth',
      APELLIDOS: 'Nicholson Araneda',
    },
    {
      N: '82',
      NOMBRES: 'Javier Hernan',
      APELLIDOS: 'Paredes Garrido',
    },
    {
      N: '83',
      NOMBRES: 'Daniela Stefania',
      APELLIDOS: 'Pino Jara',
    },
    {
      N: '84',
      NOMBRES: 'Alonso Benjamin',
      APELLIDOS: 'Pino Jara',
    },
    {
      N: '85',
      NOMBRES: 'Daniela',
      APELLIDOS: 'Quidequeo Traipe',
    },
    {
      N: '86',
      NOMBRES: 'Javiera Constanza',
      APELLIDOS: 'Quinchao Traipe',
    },
    {
      N: '87',
      NOMBRES: 'Yanara',
      APELLIDOS: 'Rebolledo Conejero',
    },
    {
      N: '88',
      NOMBRES: 'Josías',
      APELLIDOS: 'Rebolledo Conejero',
    },
    {
      N: '89',
      NOMBRES: 'Lucas Andoni',
      APELLIDOS: 'Recabarren Jara',
    },
    {
      N: '90',
      NOMBRES: 'David',
      APELLIDOS: 'Scheuermann',
    },
    {
      N: '91',
      NOMBRES: 'Franz Alexander',
      APELLIDOS: 'Schubert Calderon',
    },
    {
      N: '92',
      NOMBRES: 'Gonzalo Gustavo',
      APELLIDOS: 'Ulloa Alvarez',
    },
    {
      N: '93',
      NOMBRES: 'Samuel Alexis',
      APELLIDOS: 'Ulloa Alvarez',
    },
    {
      N: '94',
      NOMBRES: 'Felipe Andrés',
      APELLIDOS: 'Ulloa Chacón',
    },
    {
      N: '95',
      NOMBRES: 'Nehemías David',
      APELLIDOS: 'Valenzuela Díaz',
    },
    {
      N: '96',
      NOMBRES: 'Vicente',
      APELLIDOS: 'Vargas Sanchez',
    },
    {
      N: '97',
      NOMBRES: 'Felipe Ignacio',
      APELLIDOS: 'Fuenzalida Curin',
    },
    {
      N: '98',
      NOMBRES: 'Hernán Alejandro',
      APELLIDOS: 'Fuenzalida Curin',
    },
    {
      N: '99',
      NOMBRES: 'Tamara',
      APELLIDOS: 'Carrasco',
    },
    {
      N: '100',
      NOMBRES: 'Pablo',
      APELLIDOS: 'Ulloa',
    },
    {
      N: '101',
      NOMBRES: 'María Loreto',
      APELLIDOS: 'Scheuermann',
    },
    {
      N: '102',
      NOMBRES: 'Sebastian',
      APELLIDOS: 'Quidequeo',
    },
    {
      N: '103',
      NOMBRES: 'Moisés',
      APELLIDOS: 'Rebolledo',
    },
    {
      N: '104',
      NOMBRES: 'Natalia',
      APELLIDOS: 'Pichun',
    },
    {
      N: '105',
      NOMBRES: 'Loreto',
      APELLIDOS: 'Jara',
    },
    {
      N: '106',
      NOMBRES: 'Rodrigo',
      APELLIDOS: 'Scheuermann',
    },
    {
      N: '107',
      NOMBRES: 'Antonia Emilia',
      APELLIDOS: 'Recabarren Jara',
    },
    {
      N: '108',
      NOMBRES: 'Camila Paz',
      APELLIDOS: 'Cabrera Oliva',
    },
    {
      N: '109',
      NOMBRES: 'Paola',
      APELLIDOS: 'Soto',
    },
    {
      N: '110',
      NOMBRES: 'Richard',
      APELLIDOS: 'Hermosilla',
    },
    {
      N: '111',
      NOMBRES: 'Manuel Alejandro',
      APELLIDOS: 'Frias Rivas',
    },
    {
      N: '112',
      NOMBRES: 'Alonso Thomás',
      APELLIDOS: 'Frias Rivas',
    },
    {
      N: '113',
      NOMBRES: 'Jorge Elias',
      APELLIDOS: 'Pichinao Trangol',
    },
    {
      N: '114',
      NOMBRES: 'Elias Aaron',
      APELLIDOS: 'Contreras Coñoman',
    },
    {
      N: '115',
      NOMBRES: 'Guadalupe Nicole',
      APELLIDOS: 'Gomez Padilla',
    },
    {
      N: '116',
      NOMBRES: 'Isidora Belen',
      APELLIDOS: 'Perez Ormazabal',
    },
    {
      N: '117',
      NOMBRES: 'Gonzalo',
      APELLIDOS: 'Sepúlveda',
    },
    {
      N: '118',
      NOMBRES: 'David',
      APELLIDOS: 'Sanhueza',
    },
    {
      N: '119',
      NOMBRES: 'Jahel',
      APELLIDOS: 'Scheuermann',
    },
    {
      N: '120',
      NOMBRES: 'Gerzon',
      APELLIDOS: 'Sanhueza',
    },
    {
      N: '121',
      NOMBRES: 'Karen Jael',
      APELLIDOS: 'Flores Monsalve',
    },
    {
      N: '122',
      NOMBRES: 'Fernando Ezequiel',
      APELLIDOS: 'Apablaza Cabello',
    },
    {
      N: '123',
      NOMBRES: 'Camila Francisca',
      APELLIDOS: 'Fuenzalida Curin',
    },
    {
      N: '124',
      NOMBRES: 'Anita',
      APELLIDOS: 'Díaz',
    },
    {
      N: '125',
      NOMBRES: 'David',
      APELLIDOS: 'Valenzuela',
    },
    {
      N: '126',
      NOMBRES: 'Carolina',
      APELLIDOS: 'Bustamante',
    },
    {
      N: '127',
      NOMBRES: 'Hno/a 1',
      APELLIDOS: 'N/A',
    },
    {
      N: '128',
      NOMBRES: 'Hno/a 2',
      APELLIDOS: 'N/A',
    },
    {
      N: '129',
      NOMBRES: 'Hno/a 3',
      APELLIDOS: 'N/A',
    },
    {
      N: '130',
      NOMBRES: 'Hno/a 4',
      APELLIDOS: 'N/A',
    },
    {
      N: '131',
      NOMBRES: 'Hno/a 5',
      APELLIDOS: 'N/A',
    },
    {
      N: '132',
      NOMBRES: 'Hno/a 6',
      APELLIDOS: 'N/A',
    },
    {
      N: '133',
      NOMBRES: 'Hno/a 7',
      APELLIDOS: 'N/A',
    },
    {
      N: '134',
      NOMBRES: 'Hno/a 8',
      APELLIDOS: 'N/A',
    },
    {
      N: '135',
      NOMBRES: 'Hno/a 9',
      APELLIDOS: 'N/A',
    },
    {
      N: '136',
      NOMBRES: 'Hno/a 10',
      APELLIDOS: 'N/A',
    },
    {
      N: '137',
      NOMBRES: 'Hno/a 1',
      APELLIDOS: 'N/A',
    },
    {
      N: '138',
      NOMBRES: 'Tiare Margarita',
      APELLIDOS: 'Cifuentes Ulloa',
    },
    {
      N: '139',
      NOMBRES: 'Sara Elizabeth',
      APELLIDOS: 'Czischke Romero',
    },
    {
      N: '140',
      NOMBRES: 'Angela Rocío',
      APELLIDOS: 'Mansilla Prieto',
    },
    {
      N: '141',
      NOMBRES: 'Mateo F. Omar',
      APELLIDOS: 'Nahuelpán Alveal',
    },
    {
      N: '142',
      NOMBRES: 'Johanna',
      APELLIDOS: 'Silva',
    },
    {
      N: '143',
      NOMBRES: 'Andrés',
      APELLIDOS: 'Fernández',
    },
    {
      N: '144',
      NOMBRES: 'Mateo',
      APELLIDOS: 'Rivas Saavedra',
    },
    {
      N: '145',
      NOMBRES: 'Josefa Antonia',
      APELLIDOS: 'Acuña Fuentes',
    },
    {
      N: '146',
      NOMBRES: 'Florencia (credencial)',
      APELLIDOS: 'Cerda',
    },
  ];

  constructor(
    private activitySrv: ActivityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ActivityProfileComponent');

    let routeSub = this.route.paramMap
      .pipe(
        map((params) => {
          let activityId = params.get('activityId');
          return activityId || '000000';
        }),
        tap((activityId) => this.getAttendance(activityId)),
        tap(() => this.format()),
        switchMap((activityId) => this.activitySrv.get(activityId))
      )
      .subscribe((activity) => {
        this.activity = activity;
        console.log(activity);
      });
  }

  getAttendance(activityId: string) {
    this.activitySrv.attendance(activityId).subscribe((attendance) => {
      this.attendance = attendance.sort((a, b) => {
        // if (a.person_info.name.toLocaleLowerCase() < b.person_info.name.toLocaleLowerCase()) {
        //   return -1;
        // }
        // if (a.person_info.name > b.person_info.name) {
        //   return 1;
        // }
        // return 0;
        return a.person_info.name.localeCompare(b.person_info.name, "es");
      });
      // console.log(attendance);
    });
  }

  check(a: Attendance) {
    console.log(a);
    this.activitySrv.checkAttendance(a.id);
  }

  checkByCode(code: string) {
    this.activitySrv.attendanceByCode(code);
  }

  format() {
    let mapped = this.records.map((record) => {
      let temp = {
        activity_id: 'VIaRKPPGshhtKOE5CcEa',
        attendance_code: record['N'],
        observations: 'Carga masiva de prueba',
        person_id: record['N'],
        person_info: {
          first_name: record['APELLIDOS'],
          name: record['NOMBRES'],
        },
        registration_time: Timestamp.fromDate(new Date()),
      };
    //   addDoc(collection(this.firestore, 'attendance'), temp);

      return temp;
    });
    console.log(mapped);
  }
}
