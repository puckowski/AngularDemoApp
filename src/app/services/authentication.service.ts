import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public login(username: string, password: string): Observable<User> {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map((user: User) => {
                /*
                 * Store user details and jwt token in local storage to keep user logged in between page refreshes.
                 */
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);

                return user;
            }));
    }

    public logout(): void {
        /*
         * Remove user from local storage to log user out.
         */
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
