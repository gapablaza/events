import { Locality } from "./locality.model";
import { Person } from "./person.model";

export interface Registration {
    id: string;
    // event_id: string;
    // activity_id: string;
    person_id: string;
    person_info?: Person;
    locality_id?: string;
    locality_info?: Locality;
    code?: string;
    total_cost?: number;
    activities_registered?: string[];
    requires_accommodation?: boolean;
    license_plate?: string;
    vehicle_owner?: boolean;
    observations?: string;
    registered_at: number; // Unix epoch time
}