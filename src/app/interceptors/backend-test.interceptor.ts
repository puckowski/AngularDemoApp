import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, AuthorizationLevel } from '../models/user.model';
import { DataHelper } from '@app/helpers/data-helper.helper';

const users: User[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        firstName: 'Test',
        lastName: 'User',
        authorizationLevel: AuthorizationLevel.AUTHORIZATION_USER
    }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        /*
         * Call materialize and dematerialize to ensure delay even if
         * an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
         */
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute(): Observable<HttpEvent<any>> {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST': {

                    return authenticate();
                }
                case url.endsWith('/users') && method === 'GET': {

                    return getUsers();
                }
                default: {
                    /*
                     * Pass through any requests not handled above.
                     */
                    return next.handle(request);
                }
            }
        }

        function authenticate(): Observable<HttpResponse<any>> {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);

            if (DataHelper.isDefined(user) === false) {
                return ok(null);
            }

            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: null,
                authorizationLevel: user.authorizationLevel
            });
        }

        function getUsers(): Observable<HttpResponse<any>> {
            if (!isLoggedIn()) return unauthorized();

            return ok(users);
        }

        function ok(body?): Observable<HttpResponse<any>> {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message): Observable<never> {
            return throwError({ error: { message } });
        }

        function unauthorized(): Observable<never> {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn(): boolean {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let FakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
