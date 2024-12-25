export interface Person {
    id: string;
    rut?: string;
    name: string;
    middle_name?: string;
    first_name: string;
    last_name?: string;
    birthday?: string;
    email?: string;
    phone?: string;
    address?: string;
    gender?: 'M' | 'F';
    profession?: string;
    license_plate?: string;
    pathologies?: string; // TO DO: Por definir estructura
    locality_id?: string;
    locality_name?: string;
    observations?: string;
    hidden_at?: string;
}