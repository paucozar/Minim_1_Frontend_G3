import { Data } from "@angular/router";

export interface Combat {
    _id: string;
    gym: string;
    date: Data;
    boxers: string[];
}

export class Combat implements Combat {
    constructor(
    ) {}
}