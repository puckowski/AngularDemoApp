import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, AuthorizationLevel } from '../models/user.model';
import { LoginResponse } from '@app/models/login-response.model';
import { DataHelper } from '@app/helpers/data-helper.helper';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly USER_PLANNER: User = {
        id: 1,
        username: 'planner',
        password: 'planner',
        firstName: 'Test',
        lastName: 'User',
        authorizationLevel: AuthorizationLevel.AUTHORIZATION_PLANNER
    };

    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public login(username: string, password: string): Observable<User> {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(flatMap((user: User) => {
                if (DataHelper.isDefined(user) === false) {
                    return this.http.post<any>(`${environment.apiLambdaLogin}`, { username, password })
                        .pipe(map((resp: LoginResponse) => {
                            if (DataHelper.isDefined(resp.token) === true) {
                                /*
                                 * Store user details and JWT token in local storage to keep user logged in between page refreshes.
                                 */
                                this.USER_PLANNER.token = resp.token;
                                localStorage.setItem('currentUser', JSON.stringify(this.USER_PLANNER));
                                this.currentUserSubject.next(this.USER_PLANNER);

                                return this.USER_PLANNER;
                            } else {
                                return of(null);
                            }
                        }));
                } else {
                    /*
                     * Store user details in local storage to keep user logged in between page refreshes.
                     */
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);

                    return of(user);
                }
            }), catchError((error: HttpErrorResponse) => {
                return of(null);
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
