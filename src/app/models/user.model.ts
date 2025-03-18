export interface User {
    id: number;
    name: string;
    birthDate: Date;
    email: string;
    isAdmin: boolean;
    isHidden: boolean;
  }
export class User implements User {
    constructor() {}
}
  