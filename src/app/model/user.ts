import { Guid } from './Guid';

export class User {
    id: Guid;
    pseudo: string;
    email: string;
    password: string;

    constructor(pseudo:string, email:string, password:string) {
        this.id = new Guid();
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
    }
}
