import { inject, Injectable } from "@angular/core";
import { collection, collectionData, Firestore } from "@angular/fire/firestore";
import { Locality } from "../model";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocalityService {
    private _firestore = inject(Firestore);

    list(): Observable<Locality[]> {
        const refLocalities = collection(this._firestore, 'locality');
        let localities = collectionData(refLocalities, {
            idField: 'id',
        }) as Observable<any[]>;

        return localities.pipe(
            map((localities) =>
                localities.map((locality) => {
                    return { ...locality, id: locality.id } as Locality;
                }).sort((a, b) => {
                    return a.display_name.localeCompare(b.display_name, "es");
                })
            )
        );
    }
}