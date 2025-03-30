export interface Gym {
    _id: string;
    name: string;
    place: string;
    price: number;
    password: string;
    email: string;
    phone: string;
    isHidden?: boolean;
}

export class Gym implements Gym {
    constructor( 
    ) {}
}