/*export class User {
    //id: number;
    eamil: string;
    //password: string;
    firstname: string;
    lastname: string;
    role: string;
    employeeid?: number;
    token?: string;
} // v0 */
export class User {
    //id: number;
    //password: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
    employeeid?: number;
    token?: string;
}