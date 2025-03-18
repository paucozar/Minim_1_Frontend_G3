import { Data } from "@angular/router";

export interface Combat {
    id: number;
    gym: number;
    date: Data;
    boxers: string[];
}

export class Combat implements Combat {
    constructor(
    ) {}
}