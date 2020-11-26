import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;

    constructor() {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public setUser(newUser: User): void {
        this.currentUserSubject.next(newUser);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public logout(): void {
        /*
         * Remove user from local storage to log user out.
         */
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
