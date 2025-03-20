export interface User {
    id: string;
    name: string;
    birthDate: Date;
    email: string;
    isAdmin: boolean;
    isHidden: boolean;
    password: string;
  }
export class User implements User {
    constructor() {}
}
  