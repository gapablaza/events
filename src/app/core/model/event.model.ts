export interface Event {
    id: string;
    name: string;
    description: string;
    position?: number;
    active: boolean;
    hidden: boolean;
}