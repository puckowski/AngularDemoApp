export class AuthorizationLevel {
    public static readonly AUTHORIZATION_USER: number = 0;
    public static readonly AUTHORIZATION_PLANNER: number = 100;
    public static readonly AUTHORIZATION_ADMINISTRATOR: number = 200;
}

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
    authorizationLevel?: number;

    constructor() {
        return;
    }
}
